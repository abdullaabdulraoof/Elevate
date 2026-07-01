const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
    {
        memberId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        bmi: {
            type: Number,
            required: true
        },
        bodyFatPercentage: {
            type: Number,
            required: true
        },
        recordedAt: {
            type: Date,
            default: Date.now
        }
    })
module.exports = mongoose.model("Progress", progressSchema);