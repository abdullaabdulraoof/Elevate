const Trainer = require("../models/trainer");
const { validationResult } = require("express-validator");
const logger = require('../logger');
const pagination = require("../utils/pagination");
const sorting = require("../utils/sorting");
const searching = require("../utils/searching");
const filtering = require("../utils/filtering");
const fieldSelection = require("../utils/fieldSelection");
const apiResponse = require("../utils/apiResponse");
exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .select("userId specialization experience phone gender status")
      .populate("userId", "username email")
      .lean();
    apiResponse.success(res, 200, "Trainers fetched successfully", trainers);
  } catch (error) {
    logger.error("Error fetching trainers: " + error.message);
    apiResponse.error(res, 500, error.message);
  }
};

exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id)
      .select("userId specialization experience phone gender status")
      .populate("userId", "username email")
      .lean();
    if (!trainer) {
      return apiResponse.error(res, 404, "Trainer not found");
    }
    apiResponse.success(res, 200, "Trainer fetched successfully", trainer);
  } catch (error) {
    logger.error("Error fetching trainer: " + error.message);
    apiResponse.error(res, 500, error.message);
  }
};

exports.createTrainer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userId, specialization, experience, phone, gender } = req.body;
    const newTrainer = await Trainer.create({ userId, specialization, experience, phone, gender });
    const populated = await Trainer.findById(newTrainer._id)
      .select("userId specialization experience phone gender status")
      .populate("userId", "username email")
      .lean();
    apiResponse.success(res, 201, "Trainer created successfully", populated);
  } catch (error) {
    logger.error("Error creating trainer: " + error.message);
    apiResponse.error(res, 500, error.message);
  }
};

exports.updateTrainer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("userId", "username email");
    if (!updatedTrainer) {
      return apiResponse.error(res, 404, "Trainer not found");
    }
    apiResponse.success(res, 200, "Trainer updated successfully", updatedTrainer);
  } catch (error) {
    logger.error("Error updating trainer: " + error.message);
    apiResponse.error(res, 500, error.message);
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    const deletedTrainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!deletedTrainer) {
      return apiResponse.error(res, 404, "Trainer not found");
    }
    logger.info("Trainer deleted successfully");
    apiResponse.success(res, 200, "Trainer deleted successfully");
  } catch (error) {
    logger.error("Error deleting trainer: " + error.message);
    apiResponse.error(res, 500, error.message);
  }
};
exports.getAllTrainers = async (req, res) => {
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

    const allowedFilters = ['specialization', 'experience'];
    const filter = filtering(req.query, allowedFilters);

    searching(filter, searchTerm, ["name", "email", "phone"]);

    const allowedSortFields = ["name", "email", "phone", "status", "gender", "createdAt"];
    const { sortField } = sorting(sort, allowedSortFields);

    const [totalItems, trainers] = await Promise.all([
      Trainer.countDocuments(filter),
      Trainer.find(filter)
        .select(selectedFields)
        .sort(sortField)
        .skip(skip)
        .limit(pageLimit)
        .lean()
    ]);
    const totalPages = Math.ceil(totalItems / pageLimit);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    apiResponse.success(res, 200, "Trainers fetched successfully", trainers, {
      page: currentPage,
      limit: pageLimit,
      totalItems,
      totalPages,
      hasNextPage,
      hasPreviousPage
    });
  } catch (error) {
    apiResponse.error(res, 500, "Failed to fetch trainers");
  }
}