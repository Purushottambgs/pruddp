export const AFFILIATE_TAGS: Record<string, string> = {
  amazon: process.env["AMAZON_AFFILIATE_TAG"] ?? "pruddo-20",
};

export function wrapAffiliateLink(url: string, retailer: string): string {
  if (retailer === "amazon") {
    const tag = AFFILIATE_TAGS["amazon"];
    const parsed = new URL(url);
    parsed.searchParams.set("tag", tag ?? "pruddo-20");
    return parsed.toString();
  }
  return url;
}
