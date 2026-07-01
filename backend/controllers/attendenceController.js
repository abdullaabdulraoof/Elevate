const Attendance = require("../models/attendence");
const validationResult = require('express-validator').validationResult;

const getDateRange = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// CREATE / MARK ATTENDANCE
exports.markAttendance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const attendance = await Attendance.create({
      ...req.body,
      markedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark attendance"
    });
  }
};

// POST /attendance/checkin
exports.checkInAttendance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { memberId, date } = req.body;
    const attendanceDate = date ? new Date(date) : new Date();
    const { start, end } = getDateRange(attendanceDate);

    let attendance = await Attendance.findOne({
      memberId,
      date: { $gte: start, $lte: end }
    });

    if (attendance) {
      attendance.checkInTime = new Date().toISOString();
      attendance.markedBy = req.user.id;
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        memberId,
        date: attendanceDate,
        checkInTime: new Date().toISOString(),
        status: "present",
        markedBy: req.user.id
      });
    }

    res.status(200).json({
      success: true,
      message: "Check-in recorded successfully",
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to record check-in"
    });
  }
};

// POST /attendance/checkout
exports.checkOutAttendance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { memberId, date } = req.body;
    const attendanceDate = date ? new Date(date) : new Date();
    const { start, end } = getDateRange(attendanceDate);

    const attendance = await Attendance.findOne({
      memberId,
      date: { $gte: start, $lte: end }
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found for checkout"
      });
    }

    attendance.checkOutTime = new Date().toISOString();
    attendance.markedBy = req.user.id;
    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Check-out recorded successfully",
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to record check-out"
    });
  }
};

// GET ALL ATTENDANCE
exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("memberId", "name email phone")
      .populate("markedBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance"
    });
  }
};

// GET ATTENDANCE FOR A MEMBER
exports.getAttendanceByMember = async (req, res) => {
  try {
    const attendance = await Attendance.find({ memberId: req.params.id })
      .populate("memberId", "name email phone")
      .populate("markedBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch member attendance"
    });
  }
};

// UPDATE ATTENDANCE
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update attendance"
    });
  }
};

// DELETE ATTENDANCE
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete attendance"
    });
  }
};