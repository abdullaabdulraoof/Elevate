const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const {body, validationResult} = require('express-validator');
const {loginLimiter} = require('../middleware/rateLimiter');
const {registerLimiter} = require('../middleware/rateLimiter');

router.post('/register',[body('email').isEmail().withMessage('Please enter a valid email'), body('password').isLength({ min: 6, max: 100 }).withMessage('Password must be between 6 and 100 characters'),body('username').not().isEmpty().withMessage('Username is required'),body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number'),body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer'),body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other')], registerLimiter, authController.register);
router.post('/login',[body('email').isEmail().withMessage('Please enter a valid email'), body('password').isLength({ min: 6, max: 100 }).withMessage('Password must be between 6 and 100 characters')], loginLimiter, authController.login);

router.get('/profile', authenticate, authController.getProfile); 

module.exports = router;
