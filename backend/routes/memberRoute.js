const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');

const {
  createMember,
  getMembers,
  updateMember,
  deleteMember,
  updateMyPlan,
  getMyProfile
} = require("../controllers/memberController");

const { authenticate } = require("../middleware/auth");
const { allowRoles } = require("../middleware/role");

router.post("/", authenticate, allowRoles("admin", "receptionist"),[
    body('name').not().isEmpty().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phone').isMobilePhone().isLength({ min: 10, max: 15 }).withMessage('Please enter a valid phone number'),
    body('age').isInt({ min: 0 }).withMessage('Age must be a positive integer'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male or female'),
    body('address').not().isEmpty().isLength({ min: 10, max: 200 }).withMessage('Address must be between 10 and 200 characters'),
], createMember);
router.get("/", authenticate, allowRoles("admin", "trainer", "receptionist"), getMembers);
router.put("/:id", authenticate , allowRoles("admin", "receptionist"),[
    body('name').optional().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email').optional().isEmail().withMessage('Please enter a valid email'),
    body('phone').optional().isMobilePhone().isLength({ min: 10, max: 15 }).withMessage('Please enter a valid phone number'),
    body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male or female'),
    body('address').optional().isLength({ min: 10, max: 200 }).withMessage('Address must be between 10 and 200 characters'),
],updateMember);
router.get("/me", authenticate, allowRoles("member"), getMyProfile);
router.delete("/:id", authenticate, allowRoles("admin"), deleteMember);
router.patch("/me/plan", authenticate, allowRoles("member"), updateMyPlan);


module.exports = router;