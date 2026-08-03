const Plan = require("../models/plans");
const { validationResult } = require("express-validator");
const apiResponse = require("../utils/apiResponse");
const redis = require("../config/redis");
const logger = require("../logger");

const invalidatePlanCache = async () => {
    const stream = redis.scanStream({ match: "plans:*", count: 100 });
    for await (const keys of stream) {
        if (keys.length) {
            await redis.del(keys);
        }
    }
};

exports.createPlan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const plan = await Plan.create(req.body);
    await invalidatePlanCache();
    apiResponse.success(res, 201, "Plan created successfully", plan);
  } catch (error) {
    logger.error(`Failed to create plan: ${error.message}`);
    apiResponse.error(res, 500, "Failed to create plan");
  }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find()
      .select("planName duration durationType price features status ispopular macFreeDays maxTrainingSessions")
      .sort({ createdAt: -1 })
      .lean();

    apiResponse.success(res, 200, "Plans fetched successfully", plans);
  } catch (error) {
    logger.error(`Failed to fetch plans: ${error.message}`);
    apiResponse.error(res, 500, "Failed to fetch plans");
  }
};

exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
      .select("planName duration durationType price features status ispopular macFreeDays maxTrainingSessions")
      .lean();
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
    await invalidatePlanCache();
    apiResponse.success(res, 200, "Plan updated successfully", plan);
  } catch (error) {
    logger.error(`Failed to update plan: ${error.message}`);
    apiResponse.error(res, 500, "Failed to update plan");
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return apiResponse.error(res, 404, "Plan not found");
    }
    await invalidatePlanCache();
    apiResponse.success(res, 200, "Plan deleted successfully");
  } catch (error) {
    logger.error(`Failed to delete plan: ${error.message}`);
    apiResponse.error(res, 500, "Failed to delete plan");
  }
};
