const { Worker } = require("bullmq");
const redis = require("../config/redis");
const notificationService = require("../services/notificationService");

const worker = new Worker(
    "notifications",
    async (job) => {
        await notificationService.createNotification(job.data);
    },
    {
        connection: redis
    }
);