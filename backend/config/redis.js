const { Redis } = require("ioredis");
const logger = require("../logger");

const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
});

redis.on("connect", () => {
    logger.info("Redis Connected");
});

redis.on("error", (err) => {
    logger.error(`Redis Error: ${err.message}`);
});

module.exports = redis;
