import { Suspense } from "react";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  if (!q) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-400">
        <Search className="h-10 w-10" />
        <p>Enter a product name or Amazon link to get started.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Results for <span className="text-indigo-500">"{q}"</span>
      </h1>
      <p className="text-slate-500">
        Search results will appear here once the API is connected.
      </p>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Skeleton className="mb-6 h-8 w-64" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
