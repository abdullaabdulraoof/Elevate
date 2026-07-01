const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    experience: {
      type: Number,
      default: 0
    },

    phone: {
      type: String,
      required: true,
      index: true
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trainer", trainerSchema);