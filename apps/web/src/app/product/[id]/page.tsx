import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  TrendingDown,
  ChevronLeft,
  Play,
  Star,
  Users,
  Clock,
  Zap,
  Heart,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  TrendingUp,
  ArrowRight,
  Package,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrustScoreBadge } from "@/components/trust-score-badge";
import { PriceChart } from "@/components/price-chart";
import { ProductCard } from "@/components/product-card";
import { CouponCard, type Coupon } from "@/components/coupon-card";
import { TRENDING_PRODUCTS } from "@/lib/mock-products";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}

async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = TRENDING_PRODUCTS.find((p) => p.id === id) ?? TRENDING_PRODUCTS[0]!;

  const similarProducts = TRENDING_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  const PROS = [
    "Exceptional noise cancellation — best-in-class per Reddit consensus",
    "Premium sound quality with wide soundstage",
    "Comfortable for 6+ hour sessions",
    "Reliable multipoint Bluetooth connection",
    "Industry-leading 30hr battery life",
  ];

  const CONS = [
    "No IP rating for water/sweat resistance",
    "Touch controls too sensitive for some users",
    "Premium price point vs. competitors",
  ];

  const PRICES = [
    { retailer: "Amazon", price: product.price, inStock: true, badge: "Best price" },
    { retailer: "Best Buy", price: product.price + 20, inStock: true, badge: null },
    { retailer: "Walmart", price: product.price + 10, inStock: false, badge: null },
    { retailer: "Target", price: product.price + 25, inStock: true, badge: null },
  ];

  const REVIEWS = [
    {
      platform: "Reddit",
      icon: "🟠",
      count: product.sources.reddit,
      sentiment: 92,
      highlight:
        `"Coming from AirPods Pro, the noise cancellation is on a completely different level. Worth every penny."`,
      subreddit: "r/headphones",
    },
    {
      platform: "YouTube",
      icon: "🔴",
      count: product.sources.youtube,
      sentiment: 88,
      highlight: `"After testing 14 pairs, this is the one I recommend to everyone. The ANC is genuinely mind-blowing."`,
      subreddit: "MKBHD Review",
    },
    {
      platform: "Amazon",
      icon: "🟡",
      count: product.sources.amazon,
      sentiment: 85,
      highlight: `"I've bought these three times as gifts. Everyone loves them. Sound quality is exceptional."`,
      subreddit: "Verified Purchase",
    },
  ];

  const REDDIT_THREADS = [
    {
      subreddit: "r/BuyItForLife",
      title: `Is the ${product.name} worth it in 2025?`,
      upvotes: "2.4k",
      comments: 312,
      verdict: "positive",
      snippet: "After 3 years of daily use, still going strong. Best purchase I've made this decade.",
    },
    {
      subreddit: "r/frugalmalefashion",
      title: `${product.name} just dropped to lowest price ever — worth it?`,
      upvotes: "1.8k",
      comments: 204,
      verdict: "positive",
      snippet: "At this price it's a no-brainer. I've recommended it to my entire family.",
    },
    {
      subreddit: "r/skeptic",
      title: `Honest take: Overrated or genuinely great?`,
      upvotes: "743",
      comments: 89,
      verdict: "mixed",
      snippet: "The hype is real but there are cheaper alternatives that get 90% of the way there.",
    },
  ];

  const COUPONS: Coupon[] = [
    {
      id: "c1",
      code: "SAVE20",
      description: `20% off ${product.name} — no minimum spend`,
      type: "percent",
      discount: "20% off",
      savingsAmount: Math.round(product.price * 0.2 * 100) / 100,
      retailer: "Amazon",
      verified: true,
      lastVerified: "2 hours ago",
      successRate: 94,
      usedCount: 2847,
      expiresAt: "Apr 15, 2026",
      isBest: true,
      isExpired: false,
    },
    {
      id: "c2",
      code: "TECH15",
      description: "$15 off on orders over $200 in Electronics",
      type: "fixed",
      discount: "$15 off",
      savingsAmount: 15,
      retailer: "Amazon",
      verified: true,
      lastVerified: "1 day ago",
      successRate: 78,
      usedCount: 1203,
      expiresAt: "Apr 30, 2026",
      isBest: false,
      isExpired: false,
    },
    {
      id: "c3",
      code: "FREESHIP",
      description: "Free express shipping — saves $8.99 on delivery",
      type: "shipping",
      discount: "Free shipping",
      savingsAmount: 8.99,
      retailer: "Best Buy",
      verified: true,
      lastVerified: "5 hours ago",
      successRate: 91,
      usedCount: 4120,
      expiresAt: null,
      isBest: false,
      isExpired: false,
    },
    {
      id: "c4",
      code: "WELCOME10",
      description: "10% off for first-time buyers",
      type: "percent",
      discount: "10% off",
      savingsAmount: Math.round(product.price * 0.1 * 100) / 100,
      retailer: "Target",
      verified: true,
      lastVerified: "3 hours ago",
      successRate: 85,
      usedCount: 6890,
      expiresAt: "Mar 31, 2026",
      isBest: false,
      isExpired: false,
    },
    {
      id: "c5",
      code: "SPRINGSALE",
      description: "15% off sitewide — spring sale",
      type: "percent",
      discount: "15% off",
      savingsAmount: Math.round(product.price * 0.15 * 100) / 100,
      retailer: "Amazon",
      verified: false,
      lastVerified: "4 days ago",
      successRate: 22,
      usedCount: 341,
      expiresAt: "Mar 10, 2026",
      isBest: false,
      isExpired: true,
    },
  ];

  const activeCoupons = COUPONS.filter((c) => !c.isExpired);
  const expiredCoupons = COUPONS.filter((c) => c.isExpired);
  const maxSavings = activeCoupons.reduce((max, c) => Math.max(max, c.savingsAmount), 0);

  const CASHBACK = [
    { provider: "Rakuten", rate: "6% cashback", savings: `$${(product.price * 0.06).toFixed(2)} back`, logo: "R", color: "bg-red-500" },
    { provider: "TopCashback", rate: "5.5% cashback", savings: `$${(product.price * 0.055).toFixed(2)} back`, logo: "T", color: "bg-emerald-600" },
    { provider: "Capital One Shopping", rate: "Up to 4% cashback", savings: `Up to $${(product.price * 0.04).toFixed(2)} back`, logo: "C", color: "bg-blue-600" },
  ];

  const FAKE_BREAKDOWN = [
    { stars: 5, sharePercent: 68, fakePercent: 1.2 },
    { stars: 4, sharePercent: 18, fakePercent: 2.1 },
    { stars: 3, sharePercent: 8, fakePercent: 5.4 },
    { stars: 2, sharePercent: 3, fakePercent: 8.9 },
    { stars: 1, sharePercent: 3, fakePercent: 12.7 },
  ];

  const BUYER_PERSONAS = [
    { emoji: "✈️", label: "Frequent travelers", desc: "Best-in-class ANC for long flights" },
    { emoji: "🎧", label: "Audiophiles", desc: "Premium, balanced sound signature" },
    { emoji: "🏢", label: "Remote workers", desc: "Focus in noisy environments" },
    { emoji: "🎁", label: "Gift seekers", desc: "Consistently 5-star gifted item" },
  ];

  const YOUTUBE_VIDEOS = [
    {
      id: "vid-1",
      type: "In-depth Review",
      title: `${product.name}: The Most Honest Review You'll Find`,
      creator: "MKBHD",
      views: "4.2M views",
      duration: "12:34",
      postedAgo: "8 months ago",
      sentiment: "positive",
      bgFrom: "from-red-500",
      bgTo: "to-rose-600",
      keyTakeaway: "Best in category, justified premium",
    },
    {
      id: "vid-2",
      type: "Unboxing",
      title: `Unboxing & First Impressions — Is the Hype Real?`,
      creator: "Linus Tech Tips",
      views: "1.8M views",
      duration: "8:12",
      postedAgo: "10 months ago",
      sentiment: "positive",
      bgFrom: "from-yellow-400",
      bgTo: "to-orange-500",
      keyTakeaway: "Premium unboxing experience, solid build",
    },
    {
      id: "vid-3",
      type: "Short · Reel",
      title: `I tested the ANC on a NYC subway 🤯 #shorts`,
      creator: "Dave2D",
      views: "892K views",
      duration: "0:58",
      postedAgo: "6 months ago",
      sentiment: "positive",
      bgFrom: "from-violet-500",
      bgTo: "to-indigo-600",
      keyTakeaway: "ANC silences everything",
    },
    {
      id: "vid-4",
      type: "Long-term Review",
      title: `6 Months Later: My Completely Honest Opinion`,
      creator: "JerryRigEverything",
      views: "2.1M views",
      duration: "15:47",
      postedAgo: "4 months ago",
      sentiment: "mixed",
      bgFrom: "from-slate-600",
      bgTo: "to-slate-800",
      keyTakeaway: "Holds up well, some wear on pads",
    },
    {
      id: "vid-5",
      type: "Comparison",
      title: `${product.name} vs The Competition — Who Wins?`,
      creator: "The Verge",
      views: "1.1M views",
      duration: "10:22",
      postedAgo: "7 months ago",
      sentiment: "positive",
      bgFrom: "from-emerald-500",
      bgTo: "to-teal-600",
      keyTakeaway: "Still the #1 pick in its class",
    },
    {
      id: "vid-6",
      type: "Short · Reel",
      title: `POV: You just unboxed this for the first time ✨`,
      creator: "TechBurner",
      views: "445K views",
      duration: "0:45",
      postedAgo: "5 months ago",
      sentiment: "positive",
      bgFrom: "from-pink-500",
      bgTo: "to-fuchsia-600",
      keyTakeaway: "Viral unboxing reaction",
    },
  ];

  const priceVsAvg = -18; // % below average — would be computed from real price data
  const isBuyNow = priceVsAvg <= -10;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to search
        </Link>

        {/* ── Product header ─────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Image */}
          <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">{product.brand} · {product.category}</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {product.name}
              </h1>
            </div>

            {/* Authenticity row */}
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-emerald-600">
                  {(100 - product.fakeReviewPercent).toFixed(0)}% authentic reviews
                </span>
                {" "}· {product.fakeReviewPercent}% flagged as fake
              </span>
            </div>

            {/* Source badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                🟠 {product.sources.reddit.toLocaleString()} Reddit posts
              </Badge>
              <Badge variant="secondary" className="gap-1">
                🔴 {product.sources.youtube} YouTube reviews
              </Badge>
              <Badge variant="secondary" className="gap-1">
                🟡 {product.sources.amazon.toLocaleString()} Amazon reviews
              </Badge>
            </div>

            {/* Price + CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="text-3xl font-bold text-emerald-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="ml-2 text-sm text-slate-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="ml-2 inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                  <TrendingDown className="h-3.5 w-3.5" />
                  {product.priceDropPercent}% off
                </span>
              </div>
              <Button className="gap-2" asChild>
                <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer">
                  Buy on {product.retailer.charAt(0).toUpperCase() + product.retailer.slice(1)}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Trust score — right column */}
          <div className="shrink-0">
            <TrustScoreBadge score={product.trustScore} verdict={product.verdict} size="lg" />
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────────── */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-1 w-full overflow-x-auto sm:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="videos">
              Videos
              <span className="ml-1.5 rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-600">
                {YOUTUBE_VIDEOS.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="coupons">
              Coupons
              {activeCoupons.length > 0 && (
                <span className="ml-1.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-xs font-semibold text-emerald-700">
                  {activeCoupons.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="price">Price History</TabsTrigger>
            <TabsTrigger value="buy">Where to Buy</TabsTrigger>
          </TabsList>

          {/* ── Overview tab ─────────────────────────────── */}
          <TabsContent value="overview" className="mt-4 space-y-4">

            {/* AI Verdict */}
            <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
                    <Zap className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-indigo-700 dark:text-indigo-400">
                      Pruddo AI Verdict
                    </p>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      Based on {product.reviewCount.toLocaleString()} reviews across Reddit, YouTube, and Amazon —
                      the <strong>{product.name}</strong> has an overwhelmingly positive community reception.
                      Only {product.fakeReviewPercent}% of reviews were flagged as potentially inauthentic.
                      The consensus across platforms: premium build quality, best-in-class performance,
                      and long-term durability. Current price is {Math.abs(priceVsAvg)}% below the 30-day average —
                      this is a genuinely good time to buy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Buy now indicator */}
            <div className={`flex items-center gap-3 rounded-xl border p-4 ${
              isBuyNow
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
            }`}>
              {isBuyNow ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-semibold ${isBuyNow ? "text-emerald-700" : "text-amber-700"}`}>
                  {isBuyNow ? "Good time to buy" : "Price is above average"}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Current price is {Math.abs(priceVsAvg)}% {priceVsAvg < 0 ? "below" : "above"} the 30-day average.
                  {isBuyNow ? " We'd recommend buying now." : " Consider waiting for a drop."}
                </p>
              </div>
              <Button size="sm" variant={isBuyNow ? "default" : "secondary"} asChild>
                <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer">
                  Buy now <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ThumbsUp className="h-4 w-4 text-emerald-500" />
                    What people love
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {PROS.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="mt-0.5 text-emerald-500">✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ThumbsDown className="h-4 w-4 text-red-400" />
                    Common complaints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {CONS.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="mt-0.5 text-red-400">✗</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Who is this for */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-indigo-500" />
                  Who is this for?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {BUYER_PERSONAS.map((p) => (
                    <div
                      key={p.label}
                      className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/50"
                    >
                      <span className="mb-1.5 text-2xl">{p.emoji}</span>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{p.label}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fake Review Breakdown */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Fake Review Detector
                  <Badge variant="secondary" className="ml-auto text-xs font-normal">
                    Powered by Pruddo AI
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-slate-500">
                  We analyzed {product.sources.amazon.toLocaleString()} Amazon reviews for authenticity signals —
                  verified purchase rate, review velocity, linguistic patterns, and more.
                </p>
                <div className="space-y-2.5">
                  {FAKE_BREAKDOWN.map((row) => (
                    <div key={row.stars} className="flex items-center gap-3">
                      <div className="flex w-16 shrink-0 items-center gap-0.5">
                        {Array.from({ length: row.stars }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <div className="flex-1">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${row.sharePercent}%` }}
                          />
                        </div>
                      </div>
                      <span className="w-10 shrink-0 text-right text-xs text-slate-500">
                        {row.sharePercent}%
                      </span>
                      <span className={`w-24 shrink-0 text-right text-xs font-medium ${
                        row.fakePercent > 8 ? "text-red-500" : row.fakePercent > 4 ? "text-amber-500" : "text-emerald-600"
                      }`}>
                        {row.fakePercent}% fake
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-slate-400">
                  ✓ {(100 - product.fakeReviewPercent).toFixed(0)}% of reviews passed our authenticity checks.
                  Industry average fake rate: ~30%.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Reviews tab ──────────────────────────────── */}
          <TabsContent value="reviews" className="mt-4 space-y-4">
            {/* Review sources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sentiment by platform</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {REVIEWS.map((r) => (
                  <div key={r.platform} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-lg dark:bg-slate-800">
                      {r.icon}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {r.platform}
                          <span className="ml-2 text-xs text-slate-400">
                            {r.count.toLocaleString()} posts · {r.subreddit}
                          </span>
                        </span>
                        <span className="text-sm font-semibold text-emerald-600">
                          {r.sentiment}% positive
                        </span>
                      </div>
                      <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${r.sentiment}%` }}
                        />
                      </div>
                      <p className="text-sm italic text-slate-500">{r.highlight}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Reddit Threads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  🟠 Top Reddit Discussions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {REDDIT_THREADS.map((thread) => (
                  <div
                    key={thread.title}
                    className="rounded-lg border border-slate-100 p-3 transition-colors hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  >
                    <div className="mb-1.5 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <span className="text-xs font-medium text-orange-500">{thread.subreddit}</span>
                        <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                          {thread.title}
                        </p>
                      </div>
                      <Badge
                        variant={thread.verdict === "positive" ? "great" : "secondary"}
                        className="shrink-0 text-xs"
                      >
                        {thread.verdict === "positive" ? "👍 Positive" : "🤔 Mixed"}
                      </Badge>
                    </div>
                    <p className="mb-2 text-xs italic text-slate-500">"{thread.snippet}"</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {thread.upvotes} upvotes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {thread.comments} comments
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Videos tab ───────────────────────────────── */}
          <TabsContent value="videos" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {YOUTUBE_VIDEOS.length} YouTube videos analyzed
                </p>
                <p className="text-xs text-slate-500">
                  Reviews, unboxings, and shorts from top creators
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Positive
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Mixed
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {YOUTUBE_VIDEOS.map((video) => (
                <div
                  key={video.id}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  {/* Thumbnail */}
                  <div className={`relative aspect-video bg-gradient-to-br ${video.bgFrom} ${video.bgTo} flex items-center justify-center`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
                      <Play className="h-5 w-5 fill-white text-white" />
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-xs font-medium text-white">
                      {video.duration}
                    </div>
                    {/* Type badge */}
                    <div className="absolute left-2 top-2">
                      <Badge
                        variant="secondary"
                        className="border-0 bg-black/60 text-xs text-white backdrop-blur-sm"
                      >
                        {video.type}
                      </Badge>
                    </div>
                    {/* Sentiment dot */}
                    <div className={`absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white ${
                      video.sentiment === "positive" ? "bg-emerald-400" : "bg-amber-400"
                    }`} />
                  </div>

                  {/* Meta */}
                  <div className="p-3">
                    <p className="mb-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
                      {video.title}
                    </p>
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{video.creator}</span>
                      <span>{video.views}</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1.5 dark:bg-slate-800">
                      <Zap className="h-3 w-3 shrink-0 text-indigo-500" />
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        <span className="font-medium">Key takeaway:</span> {video.keyTakeaway}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      {video.postedAgo}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-slate-400">
              Pruddo analyzes video transcripts and comment sentiment — not just view counts.
            </p>
          </TabsContent>

          {/* ── Coupons tab ──────────────────────────────── */}
          <TabsContent value="coupons" className="mt-4 space-y-4">
            {/* Header banner */}
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 dark:border-emerald-800 dark:from-emerald-950/30 dark:to-slate-900">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {activeCoupons.length} active coupon{activeCoupons.length !== 1 ? "s" : ""} found
                </p>
                <p className="text-xs text-slate-500">
                  Stack with sale price — max additional savings:{" "}
                  <span className="font-semibold text-emerald-600">${maxSavings.toFixed(2)}</span>
                </p>
              </div>
              <div className="text-2xl">🎟️</div>
            </div>

            {/* Active coupons */}
            <div className="space-y-3">
              {activeCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>

            {/* Cashback section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  💰 Stack with cashback
                  <Badge variant="secondary" className="ml-auto text-xs font-normal">
                    On top of coupon savings
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="mb-3 text-xs text-slate-500">
                  Use a cashback portal before checkout and earn money back on top of any coupon code.
                </p>
                {CASHBACK.map((cb) => (
                  <div
                    key={cb.provider}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white ${cb.color}`}>
                        {cb.logo}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{cb.provider}</p>
                        <p className="text-xs text-slate-500">{cb.rate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-emerald-600">{cb.savings}</span>
                      <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300">
                        Activate →
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Expired coupons (collapsed style) */}
            {expiredCoupons.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Expired codes ({expiredCoupons.length})
                </p>
                <div className="space-y-2">
                  {expiredCoupons.map((coupon) => (
                    <CouponCard key={coupon.id} coupon={coupon} />
                  ))}
                </div>
              </div>
            )}

            {/* Extension promo */}
            <div className="flex flex-col gap-4 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 dark:border-indigo-900 dark:from-indigo-950/30 dark:to-slate-900 sm:flex-row sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-2xl">
                🔌
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Auto-apply codes at checkout
                </p>
                <p className="mt-0.5 text-sm text-slate-500">
                  Install the free Pruddo extension and we'll automatically test every code
                  at checkout — just like Honey, but with trust scores and fake review detection built in.
                </p>
              </div>
              <a
                href="https://chromewebstore.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Add to Chrome — Free
              </a>
            </div>
          </TabsContent>

          {/* ── Price tab ────────────────────────────────── */}
          <TabsContent value="price" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">30-day price history · Amazon</CardTitle>
              </CardHeader>
              <CardContent>
                <PriceChart />

                {/* Price intelligence */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
                    <p className="text-xs text-slate-500">vs 30-day average</p>
                    <p className="text-lg font-bold text-emerald-600">{Math.abs(priceVsAvg)}% below</p>
                    <p className="text-xs text-emerald-700">Good time to buy</p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500">All-time low</p>
                    <p className="text-lg font-bold text-slate-700 dark:text-slate-300">${(product.price - 10).toFixed(2)}</p>
                    <p className="text-xs text-slate-500">3 months ago</p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500">Price drops</p>
                    <p className="text-lg font-bold text-slate-700 dark:text-slate-300">4 times</p>
                    <p className="text-xs text-slate-500">in past 90 days</p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Price tracked daily across major retailers.
                </p>
                <Button variant="secondary" size="sm" className="mt-3">
                  🔔 Set price alert
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Buy tab ──────────────────────────────────── */}
          <TabsContent value="buy" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Best prices right now</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {PRICES.map((p) => (
                    <div key={p.retailer} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {p.retailer}
                        </span>
                        {p.badge && (
                          <Badge variant="great" className="text-xs">{p.badge}</Badge>
                        )}
                        {!p.inStock && (
                          <Badge variant="secondary" className="text-xs">Out of stock</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-semibold ${p.inStock ? "text-slate-900 dark:text-slate-100" : "text-slate-400"}`}>
                          ${p.price.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          variant={p.badge ? "default" : "secondary"}
                          disabled={!p.inStock}
                          asChild={p.inStock}
                        >
                          {p.inStock ? (
                            <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer">
                              Buy <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          ) : (
                            <span>Unavailable</span>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-slate-400">
                  Pruddo earns a small commission on purchases. This never influences our trust scores.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ── Similar Products ─────────────────────────── */}
        {similarProducts.length > 0 && (
          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Similar products in {product.category}
                </h2>
                <p className="text-sm text-slate-500">Other options worth considering</p>
              </div>
              <Link
                href={`/search?category=${product.category.toLowerCase().replace(" ", "-")}`}
                className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                See all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {similarProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* ── No similar products fallback ─────────────── */}
        {similarProducts.length === 0 && (
          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  More trending products
                </h2>
                <p className="text-sm text-slate-500">Top-rated picks right now</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {TRENDING_PRODUCTS.filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Skeleton className="mb-6 h-4 w-32" />
      <div className="mb-6 flex gap-6">
        <Skeleton className="h-48 w-48 rounded-xl" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-96" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-32 w-32 rounded-xl" />
      </div>
      <Skeleton className="mb-4 h-10 w-64" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
