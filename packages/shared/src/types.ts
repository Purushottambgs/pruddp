// ─── Core product types ────────────────────────────────────────────────────

export interface ProductInfo {
  id: string;
  name: string;
  brand: string;
  category: string;
  asin: string | null;
  upc: string | null;
  imageUrl: string | null;
  sourceUrl: string;
  retailer: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Trust score ───────────────────────────────────────────────────────────

export type TrustVerdict = "great_buy" | "consider" | "avoid";

export interface TrustScore {
  id: string;
  productId: string;
  score: number; // 0–100
  verdict: TrustVerdict;
  pros: string[];
  cons: string[];
  fakeReviewPercent: number;
  reviewCount: number;
  sources: ReviewSource[];
  rawAnalysis: Record<string, unknown>;
  createdAt: string;
  expiresAt: string;
}

export interface ReviewSource {
  platform: "reddit" | "youtube" | "amazon";
  count: number;
  url: string | null;
}

// ─── Reviews ───────────────────────────────────────────────────────────────

export interface ReviewSummary {
  platform: "reddit" | "youtube" | "amazon";
  totalCount: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  highlights: ReviewHighlight[];
  fetchedAt: string;
}

export interface ReviewHighlight {
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  source: string;
  url: string | null;
}

// ─── Prices ────────────────────────────────────────────────────────────────

export interface PriceComparison {
  productId: string;
  prices: RetailerPrice[];
  lowestPrice: RetailerPrice | null;
  averagePrice: number | null;
  currency: string;
  updatedAt: string;
}

export interface RetailerPrice {
  retailer: string;
  price: number;
  currency: string;
  url: string;
  affiliateUrl: string;
  inStock: boolean;
  recordedAt: string;
}

export interface PriceHistoryPoint {
  retailer: string;
  price: number;
  recordedAt: string;
}

// ─── Search ────────────────────────────────────────────────────────────────

export interface SearchResult {
  products: SearchResultItem[];
  query: string;
  total: number;
}

export interface SearchResultItem {
  id: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  lowestPrice: number | null;
  currency: string;
  trustScore: number | null;
  verdict: TrustVerdict | null;
  retailer: string;
}

// ─── Clicks / affiliate tracking ──────────────────────────────────────────

export interface ClickTrack {
  productId: string;
  retailer: string;
  source: "extension" | "website";
  affiliateUrl: string;
}

// ─── API wrapper types ─────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiError {
  error: string;
  code: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
