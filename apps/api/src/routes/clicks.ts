import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const clicksRouter = new Hono();

// POST /clicks/track
clicksRouter.post(
  "/track",
  zValidator(
    "json",
    z.object({
      productId: z.string(),
      retailer: z.string(),
      source: z.enum(["extension", "website"]),
      affiliateUrl: z.string().url(),
    })
  ),
  (c) => {
    // In production this would write to the clicks table
    return c.json({ data: { tracked: true } });
  }
);
