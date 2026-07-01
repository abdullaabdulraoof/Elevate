const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema(
    {
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: true,
            index: true
        },
        goal: {
            type: String,
            required: true
        },
        breakfast: [{
            type: String
        }],
        lunch: [{
            type: String
        }],
        dinner: [{
            type: String
        }],
        calories: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

exports.DietPlan = mongoose.model("DietPlan", dietPlanSchema);