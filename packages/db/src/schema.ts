import {
  pgTable,
  uuid,
  text,
  decimal,
  integer,
  boolean,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

// ─── products ─────────────────────────────────────────────────────────────

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    asin: text("asin"),
    upc: text("upc"),
    brand: text("brand").notNull().default(""),
    category: text("category").notNull().default(""),
    imageUrl: text("image_url"),
    sourceUrl: text("source_url").notNull(),
    retailer: text("retailer").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("products_asin_idx").on(t.asin)]
);

// ─── trust_scores ─────────────────────────────────────────────────────────

export const trustScores = pgTable("trust_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  score: integer("score").notNull(), // 0–100
  verdict: text("verdict").notNull(), // great_buy | consider | avoid
  pros: jsonb("pros").notNull().default([]),
  cons: jsonb("cons").notNull().default([]),
  fakeReviewPercent: decimal("fake_review_percent", {
    precision: 5,
    scale: 2,
  }).notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  sources: jsonb("sources").notNull().default([]),
  rawAnalysis: jsonb("raw_analysis").notNull().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

// ─── prices ───────────────────────────────────────────────────────────────

export const prices = pgTable("prices", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  retailer: text("retailer").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  url: text("url").notNull(),
  affiliateUrl: text("affiliate_url").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  recordedAt: timestamp("recorded_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── users ────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default(""),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── price_alerts ─────────────────────────────────────────────────────────

export const priceAlerts = pgTable("price_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  targetPrice: decimal("target_price", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").notNull().default(true),
  lastNotifiedAt: timestamp("last_notified_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── clicks ───────────────────────────────────────────────────────────────

export const clicks = pgTable("clicks", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  retailer: text("retailer").notNull(),
  source: text("source").notNull(), // extension | website
  affiliateUrl: text("affiliate_url").notNull(),
  clickedAt: timestamp("clicked_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
