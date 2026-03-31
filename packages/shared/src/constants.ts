export const API_BASE_URL =
  process.env["NEXT_PUBLIC_API_URL"] ??
  process.env["API_URL"] ??
  "http://localhost:3001";

export const CACHE_TTL = {
  SCORE: 48 * 60 * 60, // 48 hours in seconds
  REVIEWS: 48 * 60 * 60,
  PRICES: 1 * 60 * 60, // 1 hour
} as const;

export const TRUST_VERDICT_THRESHOLDS = {
  GREAT: 80,
  CONSIDER: 50,
} as const;

export function getTrustVerdict(
  score: number
): import("./types.js").TrustVerdict {
  if (score >= TRUST_VERDICT_THRESHOLDS.GREAT) return "great_buy";
  if (score >= TRUST_VERDICT_THRESHOLDS.CONSIDER) return "consider";
  return "avoid";
}
