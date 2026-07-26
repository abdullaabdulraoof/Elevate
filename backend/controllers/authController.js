const User = require('../models/User');
const Member = require('../models/member');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const logger = require('../logger');
const apiResponse = require('../utils/apiResponse');
require('dotenv').config();

module.exports.register = async (req, res, next) => {

  try {
    const { username, email, password, role, phone, age, gender, address, membershipPlan } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.warn(`Failed registration attempt for email: ${email}`);
      return res.status(400).json({ errors: errors.array() });
    }
    const userExists = await User.findOne({ email }).select("_id").lean();

    if (userExists) {
      logger.warn(`Failed registration attempt for email: ${email}`);
      return apiResponse.error(res, 400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "member",
      phone
    });

    const member = await Member.create({
      name: username,
      email,
      phone,
      age: age || 0,
      gender: gender || 'male',
      address: address || '',
      membershipPlan: membershipPlan || undefined
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    apiResponse.success(res, 201, "User registered successfully", {
      token,
      memberId: member._id,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role
      }
    });
    logger.info(`User registered: ${user.email}`);
  } catch (error) {
    apiResponse.error(res, 500, error.message);
    logger.error(`Error occurred while registering user: ${error.message}`);
  }
};

module.exports.login = async (req, res,   next) => {
    try {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.warn(`Failed login attempt for email: ${email}`);
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ email });
    

    if (!user) {
      logger.warn(`Failed login attempt for email: ${email}`);
      return apiResponse.error(res, 400, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn(`Failed login attempt for email: ${user.email}`);
      return apiResponse.error(res, 400, "Invalid email or password");
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    apiResponse.success(res, 200, "Login successful", {
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role
      }
    });
    logger.info(`User logged in: ${user.email}`);
  } catch (error) {
    logger.error(`Error occurred while logging in user: ${error.message}`);
    apiResponse.error(res, 500, error.message);
  }
}
module.exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password').lean();
        if (!user) {
            return apiResponse.error(res, 404, 'User not found');
        }
        logger.info(`Profile retrieved for user: ${user.email}`);
        apiResponse.success(res, 200, 'Profile retrieved successfully', user);
    } catch (error) {
        logger.error(`Error occurred while fetching user profile: ${error.message}`);
        apiResponse.error(res, 500, 'Server error');
    }
}