"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Shield, TrendingDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const EXAMPLE_SEARCHES = [
  "Sony WH-1000XM5",
  "AirPods Pro 2nd Gen",
  "Nintendo Switch OLED",
  "Kindle Paperwhite",
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-6">
          ✨ AI-powered shopping research
        </Badge>

        <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl">
          Real reviews.{" "}
          <span className="text-indigo-500">Real prices.</span>
          <br />
          Before you buy.
        </h1>

        <p className="mt-6 max-w-xl text-lg text-slate-500">
          Pruddo reads thousands of Reddit threads, YouTube reviews, and Amazon
          ratings so you don't have to — then gives you a single trust score.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="mt-10 flex w-full max-w-2xl items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Search a product or paste an Amazon link…"
              className="h-14 w-full pl-12 text-base"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button size="lg" type="submit" className="h-14 shrink-0 px-8">
            Search
          </Button>
        </form>

        {/* Example searches */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="text-sm text-slate-400">Try:</span>
          {EXAMPLE_SEARCHES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                router.push(`/search?q=${encodeURIComponent(s)}`);
              }}
              className="text-sm text-indigo-500 hover:text-indigo-600 hover:underline"
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Feature row */}
      <section className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-0 divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-slate-800">
          <FeatureCard
            icon={<Shield className="h-6 w-6 text-indigo-500" />}
            title="AI Trust Score"
            description="We detect fake reviews and give every product a 0–100 trust score you can rely on."
          />
          <FeatureCard
            icon={<TrendingDown className="h-6 w-6 text-indigo-500" />}
            title="Price History"
            description="See 30-day price history across Amazon, Best Buy, and Walmart so you never overpay."
          />
          <FeatureCard
            icon={<Star className="h-6 w-6 text-indigo-500" />}
            title="Real Reviews"
            description="Reddit threads, YouTube deep-dives, and Amazon reviews — summarized in seconds."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-start gap-3 p-8">
      {icon}
      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}
