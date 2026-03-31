import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createHash } from "crypto";
import Anthropic from "@anthropic-ai/sdk";
import { getTrustVerdict } from "@pruddo/shared";
import type { AnalysisResult } from "@pruddo/shared";
import IORedis from "ioredis";

export const analyzeRouter = new Hono();

// ─── Redis (optional, lazy init) ──────────────────────────────────────────

let _redis: IORedis | null = null;
function getRedis(): IORedis | null {
  if (!process.env["REDIS_URL"]) return null;
  if (!_redis) {
    _redis = new IORedis(process.env["REDIS_URL"], { maxRetriesPerRequest: 3 });
    _redis.on("error", (err) => console.error("[redis]", err.message));
  }
  return _redis;
}

// ─── Retailer detection ────────────────────────────────────────────────────

function detectRetailer(url: string): string {
  if (url.includes("amazon.")) return "amazon";
  if (url.includes("bestbuy.")) return "bestbuy";
  if (url.includes("walmart.")) return "walmart";
  if (url.includes("target.")) return "target";
  if (url.includes("sephora.")) return "sephora";
  if (url.includes("ulta.")) return "ulta";
  if (url.includes("costco.")) return "costco";
  if (url.includes("ebay.")) return "ebay";
  return "web";
}

// ─── Product scraper (uses og: meta tags, works on 95% of e-commerce sites) ─

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
      new RegExp(
        `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
        "i"
      ),
      new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
        "i"
      ),
      new RegExp(
        `<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`,
        "i"
      ),
      new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`,
        "i"
      ),
    ];
    for (const p of patterns) {
      const m = html.match(p);
      if (m?.[1]) return m[1].trim();
    }
    return null;
  }

  function getTitle(): string {
    // og:title first
    let t = getMeta("og:title") ?? getMeta("twitter:title") ?? "";
    // Fallback: <title> tag
    if (!t) {
      const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      t = m?.[1]?.trim() ?? "";
    }
    // Clean up Amazon boilerplate
    t = t.replace(/\s*[-|:]\s*(Amazon\.com|Amazon|Amazon\.co\.uk).*$/i, "");
    return t.slice(0, 250);
  }

  const retailer = detectRetailer(url);
  const asin = url.match(/\/dp\/([A-Z0-9]{10})/i)?.[1] ?? null;

  const name = getTitle();
  const imageUrl =
    getMeta("og:image") ?? getMeta("twitter:image:src") ?? getMeta("twitter:image") ?? null;
  const description = (
    getMeta("og:description") ??
    getMeta("twitter:description") ??
    getMeta("description") ??
    ""
  ).slice(0, 600);
  const priceStr =
    getMeta("og:price:amount") ??
    getMeta("product:price:amount") ??
    getMeta("twitter:data1") ??
    null;
  const brand =
    getMeta("og:brand") ??
    getMeta("product:brand") ??
    getMeta("og:site_name") ??
    "";
  const category = getMeta("product:category") ?? getMeta("og:type") ?? "";

  return {
    name,
    brand: brand.slice(0, 100),
    category: category.slice(0, 100),
    imageUrl,
    price: priceStr ? parseFloat(priceStr.replace(/[^0-9.]/g, "")) : null,
    currency: getMeta("og:price:currency") ?? getMeta("product:price:currency") ?? "USD",
    retailer,
    asin,
    description,
  };
}

// ─── Reddit search (no API key needed) ────────────────────────────────────

interface RedditPost {
  title: string;
  subreddit: string;
  upvotes: number;
  url: string;
  snippet: string;
}

async function searchReddit(query: string): Promise<RedditPost[]> {
  try {
    const encoded = encodeURIComponent(query);
    const res = await fetch(
      `https://www.reddit.com/search.json?q=${encoded}&sort=top&limit=10&t=year`,
      {
        headers: { "User-Agent": "Pruddo/1.0 (+https://pruddo.ai)" },
        signal: AbortSignal.timeout(8000),
      }
    );
    const json = (await res.json()) as {
      data?: { children?: { data: { title: string; subreddit: string; ups: number; permalink: string; selftext: string } }[] };
    };
    const posts = json?.data?.children ?? [];
    return posts.slice(0, 6).map((p) => ({
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

// ─── YouTube search (needs YOUTUBE_API_KEY) ────────────────────────────────

interface YouTubeVideo {
  videoId: string;
  title: string;
  channel: string;
  url: string;
}

async function searchYouTube(query: string): Promise<YouTubeVideo[]> {
  const key = process.env["YOUTUBE_API_KEY"];
  if (!key) return [];
  try {
    const encoded = encodeURIComponent(`${query} review`);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?q=${encoded}&key=${key}&maxResults=6&type=video&part=snippet&order=relevance`,
      { signal: AbortSignal.timeout(8000) }
    );
    const json = (await res.json()) as {
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
  const client = new Anthropic();

  const redditText =
    redditPosts.length > 0
      ? redditPosts.map((p) => `- "${p.title}" (${p.upvotes} upvotes)`).join("\n")
      : "No Reddit discussions found.";

  const youtubeText =
    youtubeVideos.length > 0
      ? youtubeVideos.map((v) => `- "${v.title}" by ${v.channel}`).join("\n")
      : "No YouTube videos found.";

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
${redditText}

YouTube reviews:
${youtubeText}

Return ONLY a valid JSON object with exactly these fields:
{
  "score": <integer 0-100, overall trust score>,
  "fakeReviewPercent": <number 0-100, estimated % of fake reviews>,
  "pros": [<3-5 short pro strings, each under 80 chars>],
  "cons": [<2-4 short con strings, each under 80 chars>],
  "redditSentiment": <integer 0-100, % positive sentiment from Reddit>,
  "youtubeSentiment": <integer 0-100, % positive sentiment from YouTube>,
  "buyVerdict": <one of: "Good time to buy" | "Consider alternatives" | "Avoid this product">,
  "summary": <1-2 sentence honest customer-facing summary>
}`,
      },
    ],
  });

  const content = msg.content[0];
  if (content?.type !== "text") throw new Error("Unexpected Claude response type");

  // Extract JSON — handle markdown code fences
  const jsonMatch = content.text.match(/\{[\s\S]+\}/);
  if (!jsonMatch) throw new Error("No JSON found in Claude response");

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

// ─── POST /analyze ─────────────────────────────────────────────────────────

analyzeRouter.post(
  "/",
  zValidator("json", z.object({ url: z.string().url() })),
  async (c) => {
    const { url } = c.req.valid("json");

    const cacheKey = `analyze:${createHash("md5").update(url).digest("hex")}`;
    const redis = getRedis();

    // Cache hit
    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          return c.json({ data: { ...(JSON.parse(cached) as AnalysisResult), cached: true } });
        }
      } catch {
        // cache miss is fine
      }
    }

    // Stage 1 — scrape product page
    const product = await scrapeProduct(url);

    // Stage 2 — search Reddit + YouTube in parallel
    const searchQuery = product.name || new URL(url).hostname;
    const [reddit, youtube] = await Promise.all([
      searchReddit(searchQuery),
      searchYouTube(searchQuery),
    ]);

    // Stage 3 — Claude AI analysis
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
        reddit: {
          count: reddit.length,
          sentiment: ai.redditSentiment,
          topPosts: reddit.slice(0, 4),
        },
        youtube: {
          count: youtube.length,
          sentiment: ai.youtubeSentiment,
          videos: youtube.slice(0, 4),
        },
      },
      analyzedAt: new Date().toISOString(),
      cached: false,
    };

    // Cache for 48 hours
    if (redis) {
      try {
        await redis.setex(cacheKey, 48 * 60 * 60, JSON.stringify(result));
      } catch {
        // non-fatal
      }
    }

    return c.json({ data: result });
  }
);
