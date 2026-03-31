import type {
  ProductInfo,
  TrustScore,
  ReviewSummary,
  PriceComparison,
  PriceHistoryPoint,
  SearchResult,
} from "@pruddo/shared";

export function mockProduct(id: string): ProductInfo {
  return {
    id,
    name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    brand: "Sony",
    category: "Electronics / Headphones",
    asin: "B09XS7JWHH",
    upc: "027242924918",
    imageUrl:
      "https://m.media-amazon.com/images/I/61+btxzpfDL._AC_SX679_.jpg",
    sourceUrl:
      "https://www.amazon.com/dp/B09XS7JWHH",
    retailer: "amazon",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function mockTrustScore(productId: string): TrustScore {
  return {
    id: "ts-mock-001",
    productId,
    score: 87,
    verdict: "great_buy",
    pros: [
      "Best-in-class noise cancellation",
      "Excellent sound quality",
      "Comfortable for long sessions",
    ],
    cons: [
      "Premium price point",
      "No IP rating for water resistance",
    ],
    fakeReviewPercent: 4.2,
    reviewCount: 12847,
    sources: [
      { platform: "amazon", count: 12847, url: "https://www.amazon.com/dp/B09XS7JWHH#customerReviews" },
      { platform: "reddit", count: 342, url: "https://reddit.com/search?q=WH-1000XM5" },
      { platform: "youtube", count: 28, url: null },
    ],
    rawAnalysis: { model: "claude-opus-4-6", analyzedAt: new Date().toISOString() },
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
  };
}

export function mockReviews(productId: string): ReviewSummary[] {
  return [
    {
      platform: "amazon",
      totalCount: 12847,
      positiveCount: 10234,
      negativeCount: 1102,
      neutralCount: 1511,
      highlights: [
        {
          text: "The noise cancellation is absolutely incredible. I use these on planes and the engine noise just disappears.",
          sentiment: "positive",
          source: "amazon",
          url: null,
        },
        {
          text: "Sound quality is fantastic with a wide soundstage. The multipoint connection works flawlessly.",
          sentiment: "positive",
          source: "amazon",
          url: null,
        },
        {
          text: "A bit pricey but worth every penny if you travel frequently.",
          sentiment: "neutral",
          source: "amazon",
          url: null,
        },
        {
          text: "The touch controls are too sensitive — I keep accidentally skipping songs.",
          sentiment: "negative",
          source: "amazon",
          url: null,
        },
      ],
      fetchedAt: new Date().toISOString(),
    },
    {
      platform: "reddit",
      totalCount: 342,
      positiveCount: 298,
      negativeCount: 22,
      neutralCount: 22,
      highlights: [
        {
          text: "Coming from AirPods Pro, the XM5s are on a completely different level for ANC.",
          sentiment: "positive",
          source: "reddit",
          url: "https://reddit.com/r/headphones/comments/example",
        },
      ],
      fetchedAt: new Date().toISOString(),
    },
  ];
}

export function mockPrices(productId: string): PriceComparison {
  const prices = [
    {
      retailer: "amazon",
      price: 279.99,
      currency: "USD",
      url: "https://www.amazon.com/dp/B09XS7JWHH",
      affiliateUrl: "https://www.amazon.com/dp/B09XS7JWHH?tag=pruddo-20",
      inStock: true,
      recordedAt: new Date().toISOString(),
    },
    {
      retailer: "bestbuy",
      price: 299.99,
      currency: "USD",
      url: "https://www.bestbuy.com/site/sony-wh1000xm5/6505727.p",
      affiliateUrl: "https://www.bestbuy.com/site/sony-wh1000xm5/6505727.p",
      inStock: true,
      recordedAt: new Date().toISOString(),
    },
    {
      retailer: "walmart",
      price: 289.00,
      currency: "USD",
      url: "https://www.walmart.com/ip/sony-wh1000xm5/123456789",
      affiliateUrl: "https://www.walmart.com/ip/sony-wh1000xm5/123456789",
      inStock: false,
      recordedAt: new Date().toISOString(),
    },
  ];

  return {
    productId,
    prices,
    lowestPrice: prices[0] ?? null,
    averagePrice: 289.66,
    currency: "USD",
    updatedAt: new Date().toISOString(),
  };
}

export function mockPriceHistory(productId: string): PriceHistoryPoint[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  return Array.from({ length: 30 }, (_, i) => ({
    retailer: "amazon",
    price: 270 + Math.round(Math.random() * 40),
    recordedAt: new Date(now - (29 - i) * day).toISOString(),
  }));
}

export function mockSearch(query: string): SearchResult {
  return {
    query,
    total: 3,
    products: [
      {
        id: "prod-001",
        name: "Sony WH-1000XM5",
        brand: "Sony",
        imageUrl: "https://m.media-amazon.com/images/I/61+btxzpfDL._AC_SX679_.jpg",
        lowestPrice: 279.99,
        currency: "USD",
        trustScore: 87,
        verdict: "great_buy",
        retailer: "amazon",
      },
      {
        id: "prod-002",
        name: "Bose QuietComfort 45",
        brand: "Bose",
        imageUrl: null,
        lowestPrice: 249.00,
        currency: "USD",
        trustScore: 82,
        verdict: "great_buy",
        retailer: "amazon",
      },
      {
        id: "prod-003",
        name: "Apple AirPods Pro (2nd Gen)",
        brand: "Apple",
        imageUrl: null,
        lowestPrice: 189.00,
        currency: "USD",
        trustScore: 91,
        verdict: "great_buy",
        retailer: "amazon",
      },
    ],
  };
}
