"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="/"
          className="flex shrink-0 items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100"
        >
          <span className="text-indigo-500">Pru</span>ddo
        </a>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="relative mx-auto flex w-full max-w-xl items-center"
        >
          <Search className="absolute left-3 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search products, paste Amazon link…"
            className="w-full pl-9 pr-4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {/* Auth */}
        <Button variant="secondary" size="sm" className="shrink-0">
          Login
        </Button>
      </div>
    </header>
  );
}
