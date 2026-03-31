import { Hono } from "hono";
import { mockSearch } from "../mock-data.js";

export const searchRouter = new Hono();

// GET /search?q=...
searchRouter.get("/", (c) => {
  const query = c.req.query("q") ?? "";
  return c.json({ data: mockSearch(query) });
});
