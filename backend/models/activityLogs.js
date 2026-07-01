const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true
        },
        module: {
            type: String,
            required: true,
            index: true
        },
        description: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            required: true
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }
);
activityLogSchema.index({
    userId:1,
    timestamp:-1
});
activityLogSchema.index({
    timestamp:-1
});
module.exports = mongoose.model("ActivityLog", activityLogSchema);