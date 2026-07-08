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



/** * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance APIs
 */ 

/** * @swagger
 * /api/v1/attendance:
 *   post:
 *   summary: Mark attendance for a member
 *  tags: [Attendance]
 *  requestBody:
 *    required: true
 *   content:
 *    application/json:
 *    schema:
 *    type: object
 *   required:
 *     - memberId
 *    - date
 *   - status
 *  properties:
 *    memberId:
 *   type: string
 *  example: 60d0fe4f5311236168a109ca
 *   date:
 * type: string
 * example: 2023-08-15
 *   status:
 * type: string
 * example: present
 * responses:
 *    200:
 *    description: Attendance marked successfully
 *  400:
 *  description: Bad request
 *  401:
 *  description: Unauthorized
 *  403:
 * description: Forbidden
 *  404:
 *  description: Member not found
 * 500:
 * description: Internal server error
 **/

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
/**
  * @swagger
  * /api/v1/attendance/checkin:
  * post:
  * summary: Check-in attendance for a member
  * tags: [Attendance]
  * requestBody:
  *   required: true
  *   content:
  *     application/json:
  *       schema:
  *         type: object
  *         required:
  *           - memberId
  *         properties:
  *           memberId:
  *             type: string
  *             example: 60d0fe4f5311236168a109ca
  *           date:
  *             type: string
  *             example: 2023-08-15
 * responses:
 *    200:
 *    description: Check-in successful
 *  400:
 *  description: Bad request
 *  401:
 *  description: Unauthorized
 *  403:
 * description: Forbidden
 *  404:
 *  description: Member not found
 * 500:
 * description: Internal server error
 **/
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

/**
 * @swagger
 * /api/v1/attendance/checkout:
 *   post:
 *  summary: Check-out attendance for a member
 *  tags: [Attendance]
 *  requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          required:
 *            - memberId
 *          properties:
 *            memberId:
 *              type: string
 *              example: 60d0fe4f5311236168a109ca
 *            date:
 *              type: string
 *              example: 2023-08-15
 *  responses:
 *    200:
 *      description: Check-out successful
 *    400:
 *      description: Bad request
 *    401:
 *      description: Unauthorized
 *    403:
 *      description: Forbidden
 *    404:
 *      description: Member not found
 *    500:
 *      description: Internal server error
 **/
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

/** 
 * * @swagger
 * /api/v1/attendance:
 *   get:
 * summary: Get all attendance records
 * tags: [Attendance]
 * responses:
 *   200:
 *    description: List of attendance records
 *  401:
 *   description: Unauthorized
 * 403:
 *  description: Forbidden
 * 500:
 * description: Internal server error
 
**/
 
router.get(
  "/",
  authenticate,
  allowRoles("admin", "trainer", "receptionist"),
  getAttendance
);
/**
 * * @swagger
 * /api/v1/attendance/member/{id}:
 * get:
 * summary: Get attendance records for a specific member
 * tags: [Attendance]
 * parameters:
 *   - in: path
 *    name: id
 *  required: true
 *   schema:
 *    type: string
 *  description: Member ID
 * responses:
 * 200:
 *   description: List of attendance records for the member
 * 401:
 *  description: Unauthorized
 * 403:
 * description: Forbidden
 * 404:
 * description: Member not found
 * 500:
 * description: Internal server error
 **/
router.get(
  "/member/:id",
  authenticate,
  allowRoles("admin", "trainer", "receptionist"),
  getAttendanceByMember
);
/**
 * * @swagger
 * /api/v1/attendance/{id}:
 * put:
 * summary: Update attendance record
 * tags: [Attendance]
 * parameters:  
 *  - in: path
 *   name: id
 * required: true
 * schema:
 *  type: string
 * description: Attendance record ID
 * requestBody:
 * required: true
 * content:
 *   application/json:
 *    schema:
 *    type: object
 *   properties:
 *    date:
 *  type: string
 * example: 2023-08-15
 *  status:
 * type: string
 * example: present
 * responses:
 * 200:
 * description: Attendance record updated successfully
 * 400:
 * description: Bad request
 * 401:
 * description: Unauthorized
 * 403:
 * description: Forbidden
 * 404:
 * description: Attendance record not found
 * 500:
 * description: Internal server error
 * */ 
router.put(
  "/:id",
  authenticate,
  allowRoles("admin", "trainer"),
  updateAttendance
);
/**
 * * @swagger
 * /api/v1/attendance/{id}:
 * delete:
 * summary: Delete attendance record
 * tags: [Attendance]
 * parameters:
 *  - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: Attendance record ID
 * responses:
 * 200:
 * description: Attendance record deleted successfully
 * 400:
 * description: Bad request
 * 401:
 * description: Unauthorized
 * 403:
 * description: Forbidden
 * 404:
 * description: Attendance record not found
 * 500:
 * description: Internal server error
 * */

router.delete(
  "/:id",
  authenticate,
  allowRoles("admin"),
  deleteAttendance
);

module.exports = router;