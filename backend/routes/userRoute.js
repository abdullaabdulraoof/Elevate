const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const upload = require("../middleware/upload");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadProfilePicture
} = require("../controllers/userController");

const { authenticate } = require("../middleware/auth");
const { allowRoles } = require("../middleware/role");

router.post("/", authenticate, allowRoles("admin"), [
  body('username').not().isEmpty().isLength({ min: 2, max: 50 }).withMessage('Username must be between 2 and 50 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6, max: 100 }).withMessage('Password must be between 6 and 100 characters'),
  body('role').isIn(['admin', 'trainer', 'receptionist', 'member']).withMessage('Invalid role'),
], createUser);
router.get("/", authenticate, allowRoles("admin"), getUsers);
router.get("/:id", authenticate, allowRoles("admin"), getUser);
router.put("/:id", authenticate, allowRoles("admin"), [
  body('username').optional().isLength({ min: 2, max: 50 }).withMessage('Username must be between 2 and 50 characters'),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('role').optional().isIn(['admin', 'trainer', 'receptionist', 'member']).withMessage('Invalid role'),
  body('phone').optional().isMobilePhone().isLength({ min: 10, max: 15 }).withMessage('Please enter a valid phone number'),
], updateUser);
router.delete("/:id", authenticate, allowRoles("admin"), deleteUser);
router.put(
    "/profile-picture",
    authenticate,
    upload.single("profilePicture"),
    uploadProfilePicture
);

module.exports = router;
