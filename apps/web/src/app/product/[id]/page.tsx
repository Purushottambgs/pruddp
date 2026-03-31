import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Product header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            Product #{id}
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Product name will load here
          </h1>
          <p className="mt-1 text-sm text-slate-500">Brand · Category</p>
        </div>

        {/* Trust score badge */}
        <div className="flex shrink-0 flex-col items-center rounded-xl border border-emerald-100 bg-emerald-50 px-8 py-4">
          <span className="text-4xl font-bold text-emerald-600">87</span>
          <span className="mt-1 text-sm font-medium text-emerald-600">
            Great Buy
          </span>
          <Badge variant="great" className="mt-2">
            Trust Score
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reviews">
        <TabsList>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="price">Price</TabsTrigger>
          <TabsTrigger value="buy">Buy</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Review Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500">
                Review data will load here once the API is connected.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="price">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Price Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500">
                Price history chart and retailer comparison will load here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buy">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Where to Buy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500">
                Retailer links with affiliate tracking will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex gap-4">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-96" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-28 w-36 rounded-xl" />
      </div>
      <Skeleton className="mb-4 h-10 w-64" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}
