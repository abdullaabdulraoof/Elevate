const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 1 minute."
  },
  standardHeaders: true,
  legacyHeaders: false
});
exports.registerLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again after 1 minute."
  },
  standardHeaders: true,
  legacyHeaders: false
});
