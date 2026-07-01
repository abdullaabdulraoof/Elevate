const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema(
    {
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: true,
            index: true
        },
        trainerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trainer",
            required: true
        },
        goal: {
            type: String,
            required: true
        },
        exercises: [
            {
                name: String,
                sets: Number,
                reps: Number,
                duration: String,
                rest: String
            }
        ],
        notes: {
            type: String
        }
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model("WorkoutPlan", workoutPlanSchema);