const Trainer = require("../models/trainer");
const { validationResult } = require("express-validator");
const logger = require('../logger');

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
