const redis = require("../config/redis");
const logger = require("../logger");

const READ_TIMEOUT_MS = 100;

const getCached = async (key) => {
    const read = redis.get(key).catch(() => null);
    const timeout = new Promise((resolve) => {
        setTimeout(() => resolve(null), READ_TIMEOUT_MS);
    });
    return Promise.race([read, timeout]);
};

const cache = (prefix, ttl = 300) => {
    return async (req, res, next) => {
        const key = `${prefix}:${req.originalUrl}`;

        let cachedData = null;
        try {
            cachedData = await getCached(key);
        } catch (err) {
            logger.warn(`Cache read failed (fail-open) for ${key}: ${err.message}`);
        }

        if (cachedData) {
            try {
                logger.info(`Cache HIT -> ${key}`);
                return res.status(200).json(JSON.parse(cachedData));
            } catch (err) {
                logger.warn(`Cache parse failed for ${key}: ${err.message}`);
            }
        }

        logger.info(`Cache MISS -> ${key}`);

        const originalJson = res.json.bind(res);

        res.json = (body) => {
            try {
                redis
                    .set(key, JSON.stringify(body), "EX", ttl)
                    .then(() => logger.info(`Cache SET -> ${key}`))
                    .catch((err) => logger.warn(`Cache write failed for ${key}: ${err.message}`));
            } catch (err) {
                logger.warn(`Cache write failed for ${key}: ${err.message}`);
            }
            return originalJson(body);
        };

        next();
    };
};

module.exports = cache;
