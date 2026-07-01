const express = require("express");
const router = express.Router();

const {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan
} = require("../controllers/planController");

const { authenticate } = require("../middleware/auth");
const { allowRoles } = require("../middleware/role");
const { body, validationResult } = require("express-validator");

router.post(
  "/",
  authenticate,
  allowRoles("admin"),
  [
    body('planName').not().isEmpty().withMessage('Plan name is required'),
    body('duration').isInt({ gt: 0 }).withMessage('Duration must be a positive integer'),
    body('durationType').optional().isIn(['days', 'months', 'years']).withMessage('Duration type must be days, months, or years'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  ],
  createPlan
);

router.get("/", getPlans);

router.get(
  "/:id",
  authenticate,
  allowRoles("admin", "receptionist", "trainer", "member"),
  getPlanById
);

router.put(
  "/:id",
  authenticate,
  allowRoles("admin"),
  [
    body('planName').optional().not().isEmpty().withMessage('Plan name is required'),
    body('duration').optional().isInt({ gt: 0 }).withMessage('Duration must be a positive integer'),
    body('durationType').optional().isIn(['days', 'months', 'years']).withMessage('Duration type must be days, months, or years'),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  ],
  updatePlan
);

router.delete("/:id", authenticate, allowRoles("admin"), deletePlan);

module.exports = router;
