"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Bell, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NAV_CATEGORIES = [
  { label: "Skincare", href: "/search?category=skincare" },
  { label: "Electronics", href: "/search?category=electronics" },
  { label: "Hair Care", href: "/search?category=hair-care" },
  { label: "Home", href: "/search?category=home" },
  { label: "Supplements", href: "/search?category=supplements" },
];

export function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (q.startsWith("http")) {
      router.push(`/${q}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      {/* Top bar */}
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/logo.png.png" alt="Pruddo" width={120} height={36} className="h-9 w-auto" priority />
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative mx-auto flex w-full max-w-lg items-center">
          <Search className="absolute left-3 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search or paste product URL…"
            className="w-full pl-9 pr-4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            title="Price alerts"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="hidden gap-1.5 sm:inline-flex"
          >
            <Chrome className="h-3.5 w-3.5" />
            Add extension
          </Button>
          <Button size="sm">Login</Button>
        </div>
      </div>

      {/* Category strip */}
      <div className="border-t border-slate-100 dark:border-slate-800">
        <div className="mx-auto flex max-w-7xl gap-0 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="shrink-0 border-b-2 border-transparent px-4 py-2 text-sm text-slate-500 transition hover:border-indigo-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
