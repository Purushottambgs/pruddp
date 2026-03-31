import { Worker } from "bullmq";
import { redis } from "../redis.js";

export interface PriceScrapingJob {
  productId: string;
  retailers: string[];
}

export const priceScrapingWorker = new Worker<PriceScrapingJob>(
  "price-scraping",
  async (job) => {
    console.info(`[price-scraping] Processing job ${job.id} for product ${job.data.productId}`);
    // TODO: scrape prices from each retailer
    // TODO: persist to prices table
    await new Promise((r) => setTimeout(r, 100)); // placeholder
    console.info(`[price-scraping] Done job ${job.id}`);
  },
  {
    connection: redis,
    concurrency: 10,
  }
);

priceScrapingWorker.on("failed", (job, err) => {
  console.error(`[price-scraping] Job ${job?.id} failed:`, err.message);
});
