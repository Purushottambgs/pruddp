import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { productsRouter } from "./routes/products.js";
import { searchRouter } from "./routes/search.js";
import { clicksRouter } from "./routes/clicks.js";

const app = new Hono();

// ─── Middleware ────────────────────────────────────────────────────────────

app.use(logger());

app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:3000",
      "https://pruddo.ai",
      "https://www.pruddo.ai",
      // Chrome extension origin (replace with actual extension ID in production)
      "chrome-extension://",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ─── Health check ──────────────────────────────────────────────────────────

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "pruddo-api",
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ────────────────────────────────────────────────────────────────

app.route("/products", productsRouter);
app.route("/search", searchRouter);
app.route("/clicks", clicksRouter);

// ─── 404 handler ──────────────────────────────────────────────────────────

app.notFound((c) => {
  return c.json({ error: "Not found", code: "NOT_FOUND" }, 404);
});

// ─── Error handler ─────────────────────────────────────────────────────────

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, 500);
});

// ─── Start ─────────────────────────────────────────────────────────────────

const port = Number(process.env["PORT"] ?? 3001);

serve({ fetch: app.fetch, port }, () => {
  console.info(`Pruddo API running on http://localhost:${port}`);
});
