const { Queue } = require("bullmq");
const redis = require("../config/redis");

const notificationQueue = new Queue("notifications", {
    connection: redis,
    defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 500,
    },
});

module.exports = notificationQueue;
