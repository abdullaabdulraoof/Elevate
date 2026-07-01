const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      index: true,
    },

    membershipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership"
    },

    amount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "card", "bank_transfer", "online"],
      default: "cash"
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "paid"
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    notes: {
      type: String
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  { timestamps: true }
);
paymentSchema.index({
    paymentDate:-1
});

module.exports = mongoose.model("Payment", paymentSchema);