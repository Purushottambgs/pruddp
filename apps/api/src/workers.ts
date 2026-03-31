import { Worker, Queue } from "bullmq";
import IORedis from "ioredis";

let redis: IORedis | null = null;

export function startWorkers() {
  redis = new IORedis(process.env["REDIS_URL"]!, {
    maxRetriesPerRequest: null,
  });

  redis.on("connect", () => console.info("Redis connected"));
  redis.on("error", (err) => console.error("Redis error:", err));

  const reviewWorker = new Worker(
    "review-analysis",
    async (job) => {
      console.info(`[review-analysis] Processing job ${job.id}`);
      // TODO: fetch reviews + call Claude AI
    },
    { connection: redis, concurrency: 5 }
  );

  const priceWorker = new Worker(
    "price-scraping",
    async (job) => {
      console.info(`[price-scraping] Processing job ${job.id}`);
      // TODO: scrape retailer prices
    },
    { connection: redis, concurrency: 10 }
  );

  reviewWorker.on("failed", (job, err) =>
    console.error(`[review-analysis] Job ${job?.id} failed:`, err.message)
  );
  priceWorker.on("failed", (job, err) =>
    console.error(`[price-scraping] Job ${job?.id} failed:`, err.message)
  );

  console.info("Background workers started");

  async function shutdown() {
    await Promise.all([reviewWorker.close(), priceWorker.close()]);
    await redis?.quit();
  }

  process.on("SIGINT", () => void shutdown());
  process.on("SIGTERM", () => void shutdown());
}

export function getQueue(name: string) {
  if (!redis) throw new Error("Workers not started");
  return new Queue(name, { connection: redis });
}
