const Member = require("../models/member");
const { validationResult } = require('express-validator');
const notificationQueue = require("../queues/notificationQueue");

exports.createMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const member = await Member.create(req.body);
     // Add notification job to Redis queue
    await notificationQueue.add("member-created", {
      userId: member._id,
      title: "Welcome to Elevate Gym",
      message: "Your membership has been created successfully."
    });

    res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create member"
    });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate({ path: "assignedTrainer", populate: { path: "userId", select: "username" } })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch members"
    });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate({ path: "assignedTrainer", populate: { path: "userId", select: "username" } });
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }
    res.status(200).json({
      success: true,
      message: "Member updated successfully",
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update member"
    });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }
    res.status(200).json({
      success: true,
      message: "Member deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete member"
    });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const member = await Member.findOne({ email: req.user.email });
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

exports.updateMyPlan = async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId) {
      return res.status(400).json({ success: false, message: "Plan ID is required" });
    }
    const member = await Member.findOneAndUpdate(
      { email: req.user.email },
      { membershipPlan: planId, membershipStatus: 'active' },
      { new: true }
    ).populate("membershipPlan");
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }
    res.status(200).json({
      success: true,
      message: "Membership plan updated successfully",
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update membership plan"
    });
  }
};
