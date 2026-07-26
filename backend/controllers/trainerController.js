const Trainer = require("../models/trainer");
const { validationResult } = require("express-validator");
const logger = require('../logger');
const pagination = require("../utils/pagination");
const sorting = require("../utils/sorting");
const searching = require("../utils/searching");
const filtering = require("../utils/filtering");
const fieldSelection = require("../utils/fieldSelection");
exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().populate("userId", "username email");
    res.status(200).json({ success: true, data: trainers });
  } catch (error) {
    logger.error("Error fetching trainers: " + error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id).populate("userId", "username email");
    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }
    res.status(200).json({ success: true, data: trainer });
  } catch (error) {
    logger.error("Error fetching trainer: " + error.message);
    res.status(500).json({ success: false, message: error.message });
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
    const populated = await Trainer.findById(newTrainer._id).populate("userId", "username email");
    res.status(201).json({ success: true, message: "Trainer created successfully", data: populated });
  } catch (error) {
    logger.error("Error creating trainer: " + error.message);
    res.status(500).json({ success: false, message: error.message });
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
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }
    res.status(200).json({ success: true, message: "Trainer updated successfully", data: updatedTrainer });
  } catch (error) {
    logger.error("Error updating trainer: " + error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    const deletedTrainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!deletedTrainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }
    logger.info("Trainer deleted successfully");
    res.status(200).json({ success: true, message: "Trainer deleted successfully" });
  } catch (error) {
    logger.error("Error deleting trainer: " + error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
const getAllTrainers = async (req, res) => {
  try {
    const { page, limit, sort, searching, fields } = req.query;
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
    const selectedFields = fieldSelection(
      fields,
      allowedFields
    );
    //FILTERING
    const allowedFilters = ['specialization', 'experience'];
    const filter = filtering(req.query, allowedFilters);

    //searching
    searching(filter, search, [
      "name",
      "email",
      "phone"
    ]);
    const allowedSortFields = [
      "name",
      "email",
      "phone",
      "status",
      "gender",
      "createdAt"
    ];
    const { sortField } = sorting(sort, allowedSortFields);
    const membership = await Trainer.find(filter).select(selectedFields).sort(sortField).skip(skip).limit(pageLimit);
    //calculate metadata
    const totalPages = Math.ceil(await Trainer.countDocuments(filter) / pageLimit);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    const totalItems = await Trainer.countDocuments(filter);
    res.status(200).json({
      success: true,
      data: Trainer,
      pagintion: {
        page: currentPage,
        limit: pageLimit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        totalItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch members"
    });
  }
}