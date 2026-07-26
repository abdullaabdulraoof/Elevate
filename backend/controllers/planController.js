const Plan = require("../models/plans");
const { validationResult } = require("express-validator");
const apiResponse = require("../utils/apiResponse");

exports.createPlan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const plan = await Plan.create(req.body);
    apiResponse.success(res, 201, "Plan created successfully", plan);
  } catch (error) {
    apiResponse.error(res, 500, "Failed to create plan");
  }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    apiResponse.success(res, 200, "Plans fetched successfully", plans);
  } catch (error) {
    apiResponse.error(res, 500, "Failed to fetch plans");
  }
};

exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return apiResponse.error(res, 404, "Plan not found");
    }
    apiResponse.success(res, 200, "Plan fetched successfully", plan);
  } catch (error) {
    apiResponse.error(res, 500, "Failed to fetch plan");
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
      return apiResponse.error(res, 404, "Plan not found");
    }
    apiResponse.success(res, 200, "Plan updated successfully", plan);
  } catch (error) {
    apiResponse.error(res, 500, "Failed to update plan");
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return apiResponse.error(res, 404, "Plan not found");
    }
    apiResponse.success(res, 200, "Plan deleted successfully");
  } catch (error) {
    apiResponse.error(res, 500, "Failed to delete plan");
  }
};
