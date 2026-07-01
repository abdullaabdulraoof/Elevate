const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    duration: {
      type: Number,
      required: true
    },

    durationType: {
      type: String,
      enum: ["days", "months", "years"],
      default: "months"
    },

    price: {
      type: Number,
      required: true
    },

    features: {
      type: String
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    ispopular: {
      type: Boolean,
      default: false
    },
    macFreeDays: {
      type: Number,
      default: 0
    },
    maxTrainingSessions: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);