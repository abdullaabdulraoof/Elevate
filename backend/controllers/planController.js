const Plan = require("../models/plans");
const { validationResult } = require("express-validator");

exports.createPlan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const plan = await Plan.create(req.body);
    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create plan"
    });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch plans"
    });
  }
};

exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }
    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch plan"
    });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update plan"
    });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Plan deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete plan"
    });
  }
};
