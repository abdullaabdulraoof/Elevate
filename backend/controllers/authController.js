const User = require('../models/User');
const Member = require('../models/member');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const logger = require('../logger');

module.exports.register = async (req, res, next) => {

  try {
    const { username, email, password, role, phone, age, gender, address, membershipPlan } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.warn(`Failed registration attempt for email: ${email}`);
      return res.status(400).json({ errors: errors.array() });
    }
    const userExists = await User.findOne({ email });

    if (userExists) {
      logger.warn(`Failed registration attempt for email: ${email}`);
      return res.status(400).json({ message: "User already exists" });
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

    res.status(201).json({
      message: "User registered successfully",
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
    res.status(500).json({ message: error.message });
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
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn(`Failed login attempt for email: ${user.email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
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
    res.status(500).json({ message: error.message });
  }
}
module.exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        logger.info(`Profile retrieved for user: ${user.email}`);
        res.status(200).json({user});
    } catch (error) {
        logger.error(`Error occurred while fetching user profile: ${error.message}`);
        res.status(500).json({message:'Server error', error:error.message});
    }
}