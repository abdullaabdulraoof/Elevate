const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
    {
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            index:true
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
            index:true
        },
        membershipStatus: {
            type: String,
            enum: ["free","active", "inactive"],
            default: "free",
            index:true
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date
        },
        assignedTrainer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trainer",
            index:true
        },
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index:true
        }
    },
    { timestamps: true }
);
membershipSchema.index({
  membershipStatus: 1,
  endDate: 1
});
// Trainer dashboard
membershipSchema.index({
  assignedTrainer: 1,
  membershipStatus: 1
});
module.exports = mongoose.model("Membership", membershipSchema);