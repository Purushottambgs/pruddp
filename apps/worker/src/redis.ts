import IORedis from "ioredis";

if (!process.env["REDIS_URL"]) {
  throw new Error("REDIS_URL environment variable is required");
}

export const redis = new IORedis(process.env["REDIS_URL"], {
  maxRetriesPerRequest: null, // Required for BullMQ
});

redis.on("connect", () => console.info("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));
