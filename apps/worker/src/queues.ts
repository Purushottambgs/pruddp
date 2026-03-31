import { Queue } from "bullmq";
import { redis } from "./redis.js";

export const reviewAnalysisQueue = new Queue("review-analysis", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

export const priceScrapingQueue = new Queue("price-scraping", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});
