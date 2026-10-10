const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate user via JWT from cookie or Authorization header
exports.protect = async (req, res, next) => {
  try {
    let token = null;

    // Check cookie first, then Bearer header
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'supersecret_spraysystem_jwt_key_2026'
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found or token invalid' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// Restrict access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: role '${req.user ? req.user.role : 'none'}' is not allowed to perform this action`,
      });
    }
    next();
  };
};
