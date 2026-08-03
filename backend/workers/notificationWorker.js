const { Worker } = require("bullmq");
const { Redis } = require("ioredis");
const notificationService = require("../services/notificationService");
const logger = require("../logger");

const connection = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
});

connection.on("error", (err) => {
    logger.error(`Notification worker redis error: ${err.message}`);
});

const worker = new Worker(
    "notifications",
    async (job) => {
        await notificationService.createNotification(job.data);
    },
    {
        connection,
        concurrency: 5,
    }
);

worker.on("completed", (job) => {
    logger.info(`Notification job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    logger.error(`Notification job ${job.id} failed: ${err.message}`);
});

worker.on("error", (err) => {
    logger.error(`Notification worker error: ${err.message}`);
});

module.exports = worker;
