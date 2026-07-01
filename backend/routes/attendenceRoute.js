const express = require("express");
const router = express.Router();

const {
  markAttendance,
  checkInAttendance,
  checkOutAttendance,
  getAttendance,
  getAttendanceByMember,
  updateAttendance,
  deleteAttendance
} = require("../controllers/attendenceController");

const { authenticate } = require("../middleware/auth");
const { allowRoles } = require("../middleware/role");
const { body } = require("express-validator");

router.post(
  "/",
  authenticate,
  allowRoles("admin", "trainer", "receptionist"),
  [
    body("memberId").not().isEmpty().withMessage("Member ID is required"),
    body("date").isISO8601().toDate().withMessage("Date must be a valid date"),
    body("status").isIn(["present", "absent", "late"]).withMessage("Status must be present, absent, or late")
  ],
  markAttendance
);

router.post(
  "/checkin",
  authenticate,
  allowRoles("admin", "trainer", "receptionist"),
  [
    body("memberId").not().isEmpty().withMessage("Member ID is required"),
    body("date").optional().isISO8601().toDate().withMessage("Date must be a valid date")
  ],
  checkInAttendance
);

router.post(
  "/checkout",
  authenticate,
  allowRoles("admin", "trainer", "receptionist"),
  [
    body("memberId").not().isEmpty().withMessage("Member ID is required"),
    body("date").optional().isISO8601().toDate().withMessage("Date must be a valid date")
  ],
  checkOutAttendance
);

router.get(
  "/",
  authenticate,
  allowRoles("admin", "trainer", "receptionist"),
  getAttendance
);

router.get(
  "/member/:id",
  authenticate,
  allowRoles("admin", "trainer", "receptionist"),
  getAttendanceByMember
);

router.put(
  "/:id",
  authenticate,
  allowRoles("admin", "trainer"),
  updateAttendance
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("admin"),
  deleteAttendance
);

module.exports = router;