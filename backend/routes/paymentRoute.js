const express = require("express");
const router = express.Router();

const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const { authenticate } = require("../middleware/auth");
const { allowRoles } = require("../middleware/role");
const { body, validationResult } = require("express-validator");

router.post("/create-order", authenticate, allowRoles("admin", "receptionist", "member"), createOrder);
router.post("/verify", authenticate, allowRoles("admin", "receptionist", "member"), verifyPayment);

router.post(
  "/",
  authenticate,
  allowRoles("admin", "receptionist"),
  [
    body("memberId").not().isEmpty().withMessage("Member ID is required"),
    body("amount").isFloat({ gt: 0 }).withMessage("Amount must be a positive number"),
    body("paymentDate").isISO8601().toDate().withMessage("Payment date must be a valid date"),
    body("paymentMethod").isIn(["cash", "card", "online"]).withMessage("Payment method must be cash, card, or online"),
    body("status").isIn(["pending", "completed", "failed"]).withMessage("Status must be pending, completed, or failed"),
    body("notes").optional().isLength({ max: 500 }).withMessage("Notes can be up to 500 characters long"),
  ],
  createPayment
);

router.get("/", authenticate, allowRoles("admin", "receptionist"), getPayments);
router.get("/:id", authenticate, allowRoles("admin", "receptionist"), getPaymentById);

router.put(
  "/:id",
  authenticate,
  allowRoles("admin", "receptionist"),
  [
    body("memberId").optional().not().isEmpty().withMessage("Member ID is required"),
    body("amount").optional().isFloat({ gt: 0 }).withMessage("Amount must be a positive number"),
    body("paymentDate").optional().isISO8601().toDate().withMessage("Payment date must be a valid date"),
    body("paymentMethod").optional().isIn(["cash", "card", "online"]).withMessage("Payment method must be cash, card, or online"),
    body("status").optional().isIn(["pending", "completed", "failed"]).withMessage("Status must be pending, completed, or failed"),
    body("notes").optional().isLength({ max: 500 }).withMessage("Notes can be up to 500 characters long"),
  ],
  updatePayment
);

router.delete("/:id", authenticate, allowRoles("admin"), deletePayment);

module.exports = router;
