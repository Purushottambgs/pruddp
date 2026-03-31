import { redirect } from "next/navigation";
import { AnalyzePage } from "@/components/analyze-page";

// Reconstruct a product URL from Next.js catch-all slug segments.
// Example: visiting /https://amazon.com/dp/B09X gives
//   slug = ['https:', 'amazon.com', 'dp', 'B09X']  (// collapses to single /)
// We join and restore the double-slash after the protocol.
function reconstructUrl(slug: string[]): string | null {
  const joined = slug.join("/");
  // Restore double-slash after protocol (http: or https:)
  const withProtocol = joined.replace(/^(https?):\/([^/])/, "$1://$2");

  // Must look like a valid URL with a recognised protocol
  if (!withProtocol.startsWith("http://") && !withProtocol.startsWith("https://")) {
    return null;
  }

  try {
    new URL(withProtocol); // throws if malformed
    return withProtocol;
  } catch {
    return null;
  }
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const productUrl = reconstructUrl(slug);

  // Not a URL — send to homepage
  if (!productUrl) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AnalyzePage productUrl={productUrl} />
    </div>
  );
}
