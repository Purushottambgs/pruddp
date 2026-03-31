import { reviewAnalysisWorker } from "./workers/review-analysis.worker.js";
import { priceScrapingWorker } from "./workers/price-scraping.worker.js";

console.info("Worker ready");
console.info("Active queues: review-analysis, price-scraping");

async function shutdown() {
  console.info("Shutting down workers…");
  await Promise.all([
    reviewAnalysisWorker.close(),
    priceScrapingWorker.close(),
  ]);
  process.exit(0);
}

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());
