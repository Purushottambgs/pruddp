import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  mockProduct,
  mockTrustScore,
  mockReviews,
  mockPrices,
  mockPriceHistory,
} from "../mock-data.js";

export const productsRouter = new Hono();

// POST /products/identify — identify a product from URL/ASIN
productsRouter.post(
  "/identify",
  zValidator(
    "json",
    z.object({
      url: z.string().url().optional(),
      asin: z.string().optional(),
    })
  ),
  (c) => {
    const product = mockProduct("prod-001");
    return c.json({ data: product });
  }
);

// GET /products/:id/score
productsRouter.get("/:id/score", (c) => {
  const id = c.req.param("id");
  return c.json({ data: mockTrustScore(id) });
});

// GET /products/:id/reviews
productsRouter.get("/:id/reviews", (c) => {
  const id = c.req.param("id");
  return c.json({ data: mockReviews(id) });
});

// GET /products/:id/prices
productsRouter.get("/:id/prices", (c) => {
  const id = c.req.param("id");
  return c.json({ data: mockPrices(id) });
});

// GET /products/:id/price-history
productsRouter.get("/:id/price-history", (c) => {
  const id = c.req.param("id");
  return c.json({ data: mockPriceHistory(id) });
});
