// services/notificationService.js

const Notification = require("../models/notifiation");

const createNotification = async (data) => {
    await Notification.create({
        userId: data.userId,
        title: data.title,
        message: data.message,
        isRead: false
    });

    console.log("Notification Created");
};

module.exports = {
    createNotification
};