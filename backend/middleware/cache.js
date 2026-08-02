const redis = require("../config/redis");

const cache = (prefix, ttl = 300) => {
    return async (req, res, next) => {
        try {

            // Create unique cache key
            // Example:
            // plans:/api/v1/plans?page=1&limit=10
            const key = `${prefix}:${req.originalUrl}`;

            // Check Redis
            const cachedData = await redis.get(key);

            if (cachedData) {
                console.log(`✅ Cache HIT -> ${key}`);
                return res.status(200).json(JSON.parse(cachedData));
            }

            console.log(`❌ Cache MISS -> ${key}`);

            // Save original res.json
            const originalJson = res.json.bind(res);

            // Override res.json
            res.json = async (body) => {
                try {
                    await redis.set(
                        key,
                        JSON.stringify(body),
                        "EX",
                        ttl
                    );

                    console.log(`📦 Cached -> ${key} (${ttl}s)`);
                } catch (err) {
                    console.error("Redis Cache Save Error:", err.message);
                }

                return originalJson(body);
            };

            next();

        } catch (err) {
            console.error("Redis Cache Error:", err.message);
            next();
        }
    };
};

module.exports = cache;