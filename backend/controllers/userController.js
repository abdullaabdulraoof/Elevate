const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const apiResponse = require("../utils/apiResponse");

exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password, role } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { username }] }).select("_id").lean();
    if (existing) {
      return apiResponse.error(res, 400, 'Username or email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role });
    const { password: _, ...userData } = user.toObject();
    apiResponse.success(res, 201, 'User created successfully', userData);
  } catch (error) {
    apiResponse.error(res, 500, error.message);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("username email role phone profilePicture createdAt isActive")
      .sort({ createdAt: -1 })
      .lean();
    apiResponse.success(res, 200, "Users fetched successfully", users);
  } catch (error) {
    apiResponse.error(res, 500, "Failed to fetch users");
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("username email role phone profilePicture createdAt isActive")
      .lean();
    if (!user) {
      return apiResponse.error(res, 404, "User not found");
    }
    apiResponse.success(res, 200, "User fetched successfully", user);
  } catch (error) {
    apiResponse.error(res, 500, "Failed to fetch user");
  }
};

exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!user) {
      return apiResponse.error(res, 404, "User not found");
    }
    apiResponse.success(res, 200, "User updated successfully", user);
  } catch (error) {
    apiResponse.error(res, 500, "Failed to update user");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return apiResponse.error(res, 404, "User not found");
    }
    apiResponse.success(res, 200, "User deleted successfully");
  } catch (error) {
    apiResponse.error(res, 500, "Failed to delete user");
  }
};
exports.uploadProfilePicture = async (req, res) => {
    if (!req.file) {
        return apiResponse.error(res, 400, "No file uploaded");
    }

    await User.findByIdAndUpdate(
        req.user.id,
        { profilePicture: req.file.path }
    );

    apiResponse.success(res, 200, "Profile picture uploaded", { image: req.file.path });
};