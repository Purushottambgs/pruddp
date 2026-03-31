import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-3 text-4xl font-bold text-slate-900 dark:text-slate-100">
        About Pruddo
      </h1>
      <p className="mb-10 text-lg text-slate-500">
        Making every purchase decision smarter.
      </p>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600 dark:text-slate-400">
            <p>
              Pruddo was built because shopping online is broken. Fake reviews
              are everywhere, prices fluctuate wildly, and researching a single
              product across Reddit, YouTube, and Amazon can take hours.
            </p>
            <p className="mt-3">
              We fix that by aggregating every signal that matters — community
              discussions, video deep-dives, verified purchase reviews — and
              distilling them into a single, trustworthy score.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600 dark:text-slate-400">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Paste an Amazon link or search for any product.</li>
              <li>
                Pruddo fetches reviews from Reddit, YouTube, and Amazon.
              </li>
              <li>
                Our AI (Claude by Anthropic) analyzes sentiment, detects fake
                reviews, and generates a 0–100 trust score.
              </li>
              <li>
                We show you price history across major retailers so you always
                buy at the right time.
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
