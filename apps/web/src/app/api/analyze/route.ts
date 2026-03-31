import { type NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import Anthropic from "@anthropic-ai/sdk";
import { getTrustVerdict } from "@pruddo/shared";
import type { AnalysisResult } from "@pruddo/shared";

export const maxDuration = 60;

// ─── Product scraper ───────────────────────────────────────────────────────

async function scrapeProduct(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(12000),
  });
  const html = await res.text();

  function getMeta(property: string): string | null {
    const patterns = [
      new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"),
      new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`, "i"),
    ];
    for (const p of patterns) {
      const m = html.match(p);
      if (m?.[1]) return m[1].trim();
    }
    return null;
  }

  function getTitle(): string {
    let t = getMeta("og:title") ?? getMeta("twitter:title") ?? "";
    if (!t) {
      const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      t = m?.[1]?.trim() ?? "";
    }
    t = t.replace(/\s*[-|:]\s*(Amazon\.com(\.au)?|Best Buy|Walmart|Target).*$/i, "");
    return t.slice(0, 250);
  }

  const retailer = (() => {
    if (url.includes("amazon.")) return "amazon";
    if (url.includes("bestbuy.")) return "bestbuy";
    if (url.includes("walmart.")) return "walmart";
    if (url.includes("target.")) return "target";
    if (url.includes("sephora.")) return "sephora";
    if (url.includes("ulta.")) return "ulta";
    return "web";
  })();

  return {
    name: getTitle(),
    brand: (getMeta("og:brand") ?? getMeta("og:site_name") ?? "").slice(0, 100),
    category: (getMeta("product:category") ?? "").slice(0, 100),
    imageUrl: getMeta("og:image") ?? getMeta("twitter:image") ?? null,
    price: (() => {
      const s = getMeta("og:price:amount") ?? getMeta("product:price:amount") ?? null;
      return s ? parseFloat(s.replace(/[^0-9.]/g, "")) : null;
    })(),
    currency: getMeta("og:price:currency") ?? getMeta("product:price:currency") ?? "USD",
    retailer,
    asin: url.match(/\/dp\/([A-Z0-9]{10})/i)?.[1] ?? null,
    description: (
      getMeta("og:description") ?? getMeta("description") ?? ""
    ).slice(0, 600),
  };
}

// ─── Reddit search ─────────────────────────────────────────────────────────

interface RedditPost {
  title: string;
  subreddit: string;
  upvotes: number;
  url: string;
  snippet: string;
}

async function searchReddit(query: string): Promise<RedditPost[]> {
  try {
    const res = await fetch(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=top&limit=10&t=year`,
      {
        headers: { "User-Agent": "Pruddo/1.0 (+https://pruddo.ai)" },
        signal: AbortSignal.timeout(8000),
      }
    );
    const json = await res.json() as {
      data?: { children?: { data: { title: string; subreddit: string; ups: number; permalink: string; selftext: string } }[] };
    };
    return (json?.data?.children ?? []).slice(0, 6).map((p) => ({
      title: p.data.title,
      subreddit: `r/${p.data.subreddit}`,
      upvotes: p.data.ups,
      url: `https://reddit.com${p.data.permalink}`,
      snippet: (p.data.selftext ?? "").slice(0, 200),
    }));
  } catch {
    return [];
  }
}

// ─── YouTube search ────────────────────────────────────────────────────────

interface YouTubeVideo { videoId: string; title: string; channel: string; url: string }

async function searchYouTube(query: string): Promise<YouTubeVideo[]> {
  const key = process.env["YOUTUBE_API_KEY"];
  if (!key) return [];
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(`${query} review`)}&key=${key}&maxResults=6&type=video&part=snippet&order=relevance`,
      { signal: AbortSignal.timeout(8000) }
    );
    const json = await res.json() as {
      items?: { id: { videoId: string }; snippet: { title: string; channelTitle: string } }[];
    };
    return (json.items ?? []).map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      url: `https://youtube.com/watch?v=${item.id.videoId}`,
    }));
  } catch {
    return [];
  }
}

// ─── Claude AI analysis ────────────────────────────────────────────────────

async function runAnalysis(
  productName: string,
  description: string,
  redditPosts: RedditPost[],
  youtubeVideos: YouTubeVideo[]
) {
  const client = new Anthropic({ apiKey: process.env["ANTHROPIC_API_KEY"] });

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are Pruddo's AI engine. Analyze this product and return a trust analysis.

Product: ${productName}
Description: ${description}

Reddit discussions:
${redditPosts.length > 0 ? redditPosts.map((p) => `- "${p.title}" (${p.upvotes} upvotes)`).join("\n") : "No Reddit discussions found."}

YouTube reviews:
${youtubeVideos.length > 0 ? youtubeVideos.map((v) => `- "${v.title}" by ${v.channel}`).join("\n") : "No YouTube videos found."}

Return ONLY a valid JSON object with exactly these fields:
{
  "score": <integer 0-100>,
  "fakeReviewPercent": <number 0-100>,
  "pros": [<3-5 short strings under 80 chars>],
  "cons": [<2-4 short strings under 80 chars>],
  "redditSentiment": <integer 0-100>,
  "youtubeSentiment": <integer 0-100>,
  "buyVerdict": <"Good time to buy" | "Consider alternatives" | "Avoid this product">,
  "summary": <1-2 sentence honest summary>
}`,
      },
    ],
  });

  const content = msg.content[0];
  if (content?.type !== "text") throw new Error("Unexpected Claude response");
  const jsonMatch = content.text.match(/\{[\s\S]+\}/);
  if (!jsonMatch) throw new Error("No JSON in Claude response");
  return JSON.parse(jsonMatch[0]) as {
    score: number;
    fakeReviewPercent: number;
    pros: string[];
    cons: string[];
    redditSentiment: number;
    youtubeSentiment: number;
    buyVerdict: string;
    summary: string;
  };
}

// ─── In-memory cache (survives warm lambdas, resets on redeploy) ───────────

const memCache = new Map<string, { result: AnalysisResult; expiresAt: number }>();

// ─── POST /api/analyze ─────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { url?: string };
    if (!body.url || typeof body.url !== "string") {
      return NextResponse.json({ error: "url is required", code: "MISSING_URL" }, { status: 400 });
    }

    const url = body.url.startsWith("http") ? body.url : `https://${body.url}`;
    const cacheKey = createHash("md5").update(url).digest("hex");

    // Check in-memory cache
    const cached = memCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json({ data: { ...cached.result, cached: true } });
    }

    // Run full pipeline
    const product = await scrapeProduct(url);
    const searchQuery = product.name || new URL(url).hostname;
    const [reddit, youtube] = await Promise.all([
      searchReddit(searchQuery),
      searchYouTube(searchQuery),
    ]);
    const ai = await runAnalysis(product.name, product.description, reddit, youtube);

    const result: AnalysisResult = {
      url,
      product: {
        name: product.name || "Unknown Product",
        brand: product.brand,
        category: product.category,
        imageUrl: product.imageUrl,
        price: product.price,
        currency: product.currency,
        retailer: product.retailer,
        asin: product.asin,
      },
      trustScore: ai.score,
      verdict: getTrustVerdict(ai.score),
      fakeReviewPercent: ai.fakeReviewPercent,
      pros: ai.pros,
      cons: ai.cons,
      buyVerdict: ai.buyVerdict,
      summary: ai.summary,
      sources: {
        reddit: { count: reddit.length, sentiment: ai.redditSentiment, topPosts: reddit.slice(0, 4) },
        youtube: { count: youtube.length, sentiment: ai.youtubeSentiment, videos: youtube.slice(0, 4) },
      },
      analyzedAt: new Date().toISOString(),
      cached: false,
    };

    // Cache for 48 hours
    memCache.set(cacheKey, { result, expiresAt: Date.now() + 48 * 60 * 60 * 1000 });

    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("[/api/analyze]", err);
    return NextResponse.json(
      { error: "Analysis failed — please try again", code: "ANALYSIS_ERROR" },
      { status: 500 }
    );
  }
}
