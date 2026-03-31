import { Worker } from "bullmq";
import { redis } from "../redis.js";

export interface ReviewAnalysisJob {
  productId: string;
  asin: string;
}

export const reviewAnalysisWorker = new Worker<ReviewAnalysisJob>(
  "review-analysis",
  async (job) => {
    console.info(`[review-analysis] Processing job ${job.id} for product ${job.data.productId}`);
    // TODO: fetch reviews from Reddit, YouTube, Amazon
    // TODO: call @pruddo/ai to generate trust score
    // TODO: persist result to database
    await new Promise((r) => setTimeout(r, 100)); // placeholder
    console.info(`[review-analysis] Done job ${job.id}`);
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

reviewAnalysisWorker.on("failed", (job, err) => {
  console.error(`[review-analysis] Job ${job?.id} failed:`, err.message);
});
