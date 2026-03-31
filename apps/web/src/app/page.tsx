"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsBar } from "@/components/stats-bar";
import { HowItWorks } from "@/components/how-it-works";
import { TrendingProducts } from "@/components/trending-products";
import { CategoryGrid } from "@/components/category-grid";
import { WhyPruddo } from "@/components/why-pruddo";
import { ExtensionBanner } from "@/components/extension-banner";
import { Footer } from "@/components/footer";

const EXAMPLE_SEARCHES = [
  "CeraVe moisturizer",
  "Sony WH-1000XM5",
  "Dyson Airwrap",
  "AirPods Pro",
  "The Ordinary Niacinamide",
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    // URL → catch-all analyze route (pruddo.ai/{url})
    if (q.startsWith("http")) {
      router.push(`/${q}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pb-16 pt-20 dark:from-slate-950 dark:to-slate-900">
        {/* Subtle grid bg */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          {/* Pill badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
            2M+ products analyzed · Updated daily
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl">
            Don't get fooled by{" "}
            <span className="relative text-red-500">
              fake reviews
            </span>
            <br />
            again.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
            Pruddo reads Reddit, YouTube, and Amazon so you don't have to.
            Paste any product link — get a trust score, real pros & cons, and
            the lowest price in 60 seconds.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-10">
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search a product or paste Amazon / Sephora link…"
                  className="h-14 w-full rounded-xl pl-12 text-base shadow-sm"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button size="lg" type="submit" className="h-14 shrink-0 gap-2 rounded-xl px-8 shadow-sm">
                Analyze
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Example chips */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-slate-400">Try:</span>
              {EXAMPLE_SEARCHES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setQuery(s);
                    router.push(`/search?q=${encodeURIComponent(s)}`);
                  }}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900"
                >
                  {s}
                </button>
              ))}
            </div>
          </form>

          {/* Social proof avatars */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {["🧴", "📱", "💄", "🎧", "💊"].map((emoji, i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-sm dark:border-slate-900 dark:bg-slate-800"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-900 dark:text-slate-100">142,000+</span>{" "}
              shoppers made smarter decisions this week
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <StatsBar />

      {/* ── Trending products ─────────────────────────────────── */}
      <TrendingProducts />

      {/* ── How it works ──────────────────────────────────────── */}
      <HowItWorks />

      {/* ── Categories ────────────────────────────────────────── */}
      <CategoryGrid />

      {/* ── Why Pruddo ────────────────────────────────────────── */}
      <WhyPruddo />

      {/* ── Extension banner ──────────────────────────────────── */}
      <ExtensionBanner />

      {/* ── Footer ────────────────────────────────────────────── */}
      <Footer />
    </>
  );
}
