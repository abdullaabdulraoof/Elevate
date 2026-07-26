const Member = require("../models/member");
const { validationResult } = require('express-validator');
const notificationQueue = require("../queues/notificationQueue");
const pagination = require("../utils/pagination");
const sorting = require("../utils/sorting");
const searching = require("../utils/searching");
const filtering = require("../utils/filtering");
const fieldSelection = require("../utils/fieldSelection");
const apiResponse = require("../utils/apiResponse");
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

    apiResponse.success(
      res,
      201,
      "Member created successfully",
      member
    );
  } catch (error) {
    apiResponse.error(
      res,
      500,
      "Failed to create member"
    );
  }
};

exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .select("name email phone age gender membershipPlan membershipStatus assignedTrainer")
      .populate({ path: "assignedTrainer", populate: { path: "userId", select: "username" } })
      .sort({ createdAt: -1 })
      .lean();

    apiResponse.success(res, 200, "Members fetched successfully", members);
  } catch (error) {
    apiResponse.error(res, 500, "Failed to fetch members");
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
      return apiResponse.error(res, 404, "Member not found");
    }
    apiResponse.success(res, 200, "Member updated successfully", member);
  } catch (error) {
    apiResponse.error(res, 500, "Failed to update member");
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return apiResponse.error(res, 404, "Member not found");
    }
    apiResponse.success(res, 200, "Member deleted successfully");
  } catch (error) {
    apiResponse.error(res, 500, "Failed to delete member");
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const member = await Member.findOne({ email: req.user.email })
      .select("name email phone age gender address height weight goals membershipPlan membershipStatus assignedTrainer")
      .lean();
    if (!member) {
      return apiResponse.error(res, 404, "Member not found");
    }
    apiResponse.success(res, 200, "Profile fetched successfully", member);
  } catch (error) {
    apiResponse.error(res, 500, "Failed to fetch profile");
  }
};

exports.updateMyPlan = async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId) {
      return apiResponse.error(res, 400, "Plan ID is required");
    }
    const member = await Member.findOneAndUpdate(
      { email: req.user.email },
      { membershipPlan: planId, membershipStatus: 'active' },
      { new: true }
    ).populate({ path: "membershipPlan", select: "planName price duration durationType features" });
    if (!member) {
      return apiResponse.error(res, 404, "Member not found");
    }
    apiResponse.success(res, 200, "Membership plan updated successfully", member);
  } catch (error) {
    apiResponse.error(res, 500, "Failed to update membership plan");
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const { page, limit, sort, searching: searchTerm, fields } = req.query;
    const { skip, page: currentPage, limit: pageLimit } = pagination(page, limit);
    const allowedFields = [
      "name",
      "email",
      "phone",
      "gender",
      "status",
      "membershipPlan",
      "createdAt"
    ];
    const selectedFields = fieldSelection(fields, allowedFields);

    const allowedFilters = ['status', 'gender', 'membershipPlan'];
    const filter = filtering(req.query, allowedFilters);

    searching(filter, searchTerm, ["name", "email", "phone"]);

    const allowedSortFields = ["name", "email", "phone", "status", "gender", "createdAt"];
    const { sortField } = sorting(sort, allowedSortFields);

    const [totalItems, members] = await Promise.all([
      Member.countDocuments(filter),
      Member.find(filter)
        .select(selectedFields)
        .sort(sortField)
        .skip(skip)
        .limit(pageLimit)
        .lean()
    ]);

    const totalPages = Math.ceil(totalItems / pageLimit);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    apiResponse.success(res, 200, "Members fetched successfully", members, {
      page: currentPage,
      limit: pageLimit,
      totalItems,
      totalPages,
      hasNextPage,
      hasPreviousPage
    });
  } catch (error) {
    apiResponse.error(res, 500, "Failed to fetch members");
  }
}