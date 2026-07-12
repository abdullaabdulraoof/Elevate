const { Queue } = require("bullmq");
const redis = require("../config/redis");

let notificationQueue= null;
if (process.env.NODE_ENV === "production") {
    notificationQueue = new Queue("notifications", {
        connection: redis
    });
}

module.exports = notificationQueue;