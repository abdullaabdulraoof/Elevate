const jwt = require('jsonwebtoken');
const userModel = require('../models/User');
// Authentication middleware
const authenticate = async (req, res, next) => {
try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await userModel.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { authenticate };