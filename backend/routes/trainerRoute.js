const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer
} = require("../controllers/trainerController");

const { authenticate } = require("../middleware/auth");
const { allowRoles } = require("../middleware/role");

router.get("/", authenticate, allowRoles("admin", "trainer", "receptionist"), getTrainers);
router.get("/:id", authenticate, allowRoles("admin", "trainer", "receptionist"), getTrainerById);
router.post("/", authenticate, allowRoles("admin"), [
  body('userId').not().isEmpty().withMessage('userId is required'),
  body('specialization').not().isEmpty().withMessage('Specialization is required'),
  body('phone').not().isEmpty().withMessage('Phone is required'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
], createTrainer);
router.put("/:id", authenticate, allowRoles("admin"), updateTrainer);
router.delete("/:id", authenticate, allowRoles("admin"), deleteTrainer);

module.exports = router;
