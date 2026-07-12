const express = require('express');
const router = express.Router();
require('dotenv').config();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const {body, validationResult} = require('express-validator');
const {loginLimiter} = require('../middleware/rateLimiter');
const {registerLimiter} = require('../middleware/rateLimiter');
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 */
router.post('/login',[body('email').isEmail().withMessage('Please enter a valid email'), body('password').isLength({ min: 6, max: 100 }).withMessage('Password must be between 6 and 100 characters')], loginLimiter, authController.login);
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/RegisterRequest'
 */
router.post('/register',[body('email').isEmail().withMessage('Please enter a valid email'), body('password').isLength({ min: 6, max: 100 }).withMessage('Password must be between 6 and 100 characters'),body('username').not().isEmpty().withMessage('Username is required'),body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number'),body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer'),body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other')], registerLimiter, authController.register);
/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticate, authController.getProfile); 

module.exports = router;
