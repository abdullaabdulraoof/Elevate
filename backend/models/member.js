const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: String,
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    age: Number,
    gender: String,
    address: String,
    height: Number,
    weight: Number,
    goals: {
      type: String,
      inedx: true
    },
    membershipPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      index: true
    },
    membershipStatus: {
      type: String,
      enum: ["free", "active", "inactive"],
      default: "free"
    },
    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      index: true
    },
    profilePicture: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);