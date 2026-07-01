const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true
    },

    date: {
      type: Date,
      default: Date.now
    },

    checkInTime: {
      type: String
    },

    checkOutTime: {
      type: String
    },

    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present"
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);
attendanceSchema.index({
    memberId:1,
    date:1
});
module.exports = mongoose.model("Attendance", attendanceSchema);