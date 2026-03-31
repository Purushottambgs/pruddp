"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  TrendingUp,
  MessageCircle,
  Play,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import type { AnalysisResult } from "@pruddo/shared";
import { TrustScoreBadge } from "@/components/trust-score-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Loading steps shown during analysis ──────────────────────────────────

const STEPS = [
  { icon: "🔍", label: "Fetching product page", ms: 2500 },
  { icon: "🟠", label: "Searching Reddit discussions", ms: 5500 },
  { icon: "🔴", label: "Searching YouTube reviews", ms: 8500 },
  { icon: "🤖", label: "Running Pruddo AI analysis", ms: 13000 },
];

function LoadingView({ url }: { url: string }) {
  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((step, i) =>
      setTimeout(() => setCompletedSteps(i + 1), step.ms)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Analyzing product...
        </h1>
        <p className="max-w-xs text-sm text-slate-500 break-all">
          {url.length > 60 ? `${url.slice(0, 60)}…` : url}
        </p>
      </div>

      <div className="space-y-3 text-left">
        {STEPS.map((step, i) => {
          const done = i < completedSteps;
          const active = i === completedSteps;
          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                done
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                  : active
                  ? "border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/30"
                  : "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              <span className="text-xl">{step.icon}</span>
              <span
                className={`flex-1 text-sm font-medium ${
                  done
                    ? "text-emerald-700 dark:text-emerald-400"
                    : active
                    ? "text-indigo-700 dark:text-indigo-400"
                    : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
              {done && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              {active && (
                <RefreshCw className="h-4 w-4 animate-spin text-indigo-500" />
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-slate-400">
        This usually takes 15–25 seconds. Grabbing real data from the internet.
      </p>
    </div>
  );
}

// ─── Result view ──────────────────────────────────────────────────────────

function ResultView({ result }: { result: AnalysisResult }) {
  const { product, sources } = result;

  const isBuy = result.buyVerdict === "Good time to buy";
  const isAvoid = result.buyVerdict === "Avoid this product";

  const BuyIcon = isBuy ? CheckCircle2 : isAvoid ? XCircle : AlertTriangle;
  const buyColor = isBuy
    ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
    : isAvoid
    ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
    : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30";
  const buyTextColor = isBuy
    ? "text-emerald-700 dark:text-emerald-400"
    : isAvoid
    ? "text-red-700 dark:text-red-400"
    : "text-amber-700 dark:text-amber-400";
  const buyIconColor = isBuy ? "text-emerald-600" : isAvoid ? "text-red-500" : "text-amber-500";

  const retailerLabel =
    product.retailer.charAt(0).toUpperCase() + product.retailer.slice(1);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to search
      </Link>

      {/* Cache notice */}
      {result.cached && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          ⚡ Loaded from cache · analyzed {new Date(result.analyzedAt).toLocaleDateString()}
        </div>
      )}

      {/* ── Product header ─────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Image */}
        {product.imageUrl && (
          <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-2"
              unoptimized
            />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-3">
          <div>
            {(product.brand || product.category) && (
              <p className="text-sm font-medium text-slate-500">
                {[product.brand, product.category].filter(Boolean).join(" · ")}
              </p>
            )}
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {product.name}
            </h1>
          </div>

          {/* Authenticity */}
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-emerald-600">
                {(100 - result.fakeReviewPercent).toFixed(0)}% authentic reviews
              </span>
              {" "}· {result.fakeReviewPercent.toFixed(1)}% flagged as fake
            </span>
          </div>

          {/* Source badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              🟠 {sources.reddit.count} Reddit discussions
            </Badge>
            <Badge variant="secondary">
              🔴 {sources.youtube.count} YouTube videos
            </Badge>
            <Badge variant="secondary">
              📦 {retailerLabel}
              {product.asin && ` · ASIN: ${product.asin}`}
            </Badge>
          </div>

          {/* Price + CTA */}
          <div className="flex flex-wrap items-center gap-4">
            {product.price !== null && (
              <span className="text-3xl font-bold text-emerald-600">
                {product.currency === "USD" ? "$" : product.currency}
                {product.price.toFixed(2)}
              </span>
            )}
            <Button className="gap-2" asChild>
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                View on {retailerLabel}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Trust score */}
        <div className="shrink-0">
          <TrustScoreBadge
            score={result.trustScore}
            verdict={result.verdict}
            size="lg"
          />
        </div>
      </div>

      {/* ── Main content ───────────────────────────────── */}
      <div className="space-y-4">

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
                  {result.summary}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buy verdict banner */}
        <div className={`flex items-center gap-3 rounded-xl border p-4 ${buyColor}`}>
          <BuyIcon className={`h-5 w-5 shrink-0 ${buyIconColor}`} />
          <div className="flex-1">
            <p className={`text-sm font-semibold ${buyTextColor}`}>
              {result.buyVerdict}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Trust score: {result.trustScore}/100 ·{" "}
              {result.fakeReviewPercent.toFixed(1)}% estimated fake reviews
            </p>
          </div>
          <Button size="sm" variant={isBuy ? "default" : "secondary"} asChild>
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              {isBuy ? "Buy now" : "View product"}{" "}
              <ExternalLink className="ml-1 h-3 w-3" />
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
                {result.pros.map((pro) => (
                  <li
                    key={pro}
                    className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                  >
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
                {result.cons.map((con) => (
                  <li
                    key={con}
                    className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span className="mt-0.5 text-red-400">✗</span>
                    {con}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Reddit discussions */}
        {sources.reddit.topPosts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                🟠 Reddit Discussions
                <span className="ml-auto text-sm font-normal text-emerald-600">
                  {sources.reddit.sentiment}% positive
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Sentiment bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${sources.reddit.sentiment}%` }}
                />
              </div>

              {sources.reddit.topPosts.map((post) => (
                <a
                  key={post.url}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col rounded-lg border border-slate-100 p-3 transition-colors hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <span className="text-xs font-medium text-orange-500">
                      {post.subreddit}
                    </span>
                    <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
                  </div>
                  <p className="mb-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {post.title}
                  </p>
                  {post.snippet && (
                    <p className="mb-1.5 text-xs italic text-slate-500 line-clamp-2">
                      "{post.snippet}"
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {post.upvotes.toLocaleString()} upvotes
                    </span>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>
        )}

        {/* YouTube videos */}
        {sources.youtube.videos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                🔴 YouTube Reviews
                <span className="ml-auto text-sm font-normal text-emerald-600">
                  {sources.youtube.sentiment}% positive
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Sentiment bar */}
              <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${sources.youtube.sentiment}%` }}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {sources.youtube.videos.map((video) => (
                  <a
                    key={video.videoId}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950">
                      <Play className="h-4 w-4 fill-red-500 text-red-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                        {video.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">{video.channel}</p>
                    </div>
                    <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer disclaimer */}
        <p className="text-center text-xs text-slate-400">
          Analysis powered by Pruddo AI · Data sourced from Reddit, YouTube, and product pages ·{" "}
          {new Date(result.analyzedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// ─── Error view ────────────────────────────────────────────────────────────

function ErrorView({ url, message }: { url: string; message: string }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="mb-6 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Analysis failed
        </h1>
        <p className="text-sm text-slate-500">{message}</p>
        <p className="max-w-xs break-all text-xs text-slate-400">{url}</p>
      </div>
      <div className="flex justify-center gap-3">
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-3.5 w-3.5" />
          Try again
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export function AnalyzePage({ productUrl }: { productUrl: string }) {
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "done"; result: AnalysisResult }
    | { status: "error"; message: string }
  >({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: productUrl }),
    })
      .then((res) => res.json())
      .then((json: { data?: AnalysisResult; error?: string }) => {
        if (cancelled) return;
        if (json.data) {
          setState({ status: "done", result: json.data });
        } else {
          setState({ status: "error", message: json.error ?? "Unknown error" });
        }
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setState({ status: "error", message: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [productUrl]);

  if (state.status === "loading") return <LoadingView url={productUrl} />;
  if (state.status === "error") return <ErrorView url={productUrl} message={state.message} />;
  return <ResultView result={state.result} />;
}
