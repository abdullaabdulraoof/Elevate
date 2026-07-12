const { Redis } = require("ioredis");

let redis;

if (process.env.NODE_ENV !== "test") {
    redis = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        maxRetriesPerRequest: null,
    });
} else {
    // Mock Redis for tests
    redis = {
        on: () => {},
        quit: async () => {},
        disconnect: () => {},
    };
}

module.exports = redis;