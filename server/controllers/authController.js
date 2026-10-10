const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helper to sign JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'supersecret_spraysystem_jwt_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Helper to sanitize user object and avoid leaking database schema/internals
const sanitizeUser = (user) => {
  if (!user) return null;
  return {
    _id: user._id,
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
};

// Helper to send cookie + JSON response
const sendAuthResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id, user.role);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    message,
    token,
    user: sanitizeUser(user),
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email or username already exists' });
    }

    // Hash password directly here in controller
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with hashed password - public signups are strictly 'user' role
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user',
    });

    const savedUser = await newUser.save();

    sendAuthResponse(savedUser, 201, res, 'User registered successfully');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/signin
// @access  Public
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password directly here in controller
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    sendAuthResponse(user, 200, res, 'Signed in successfully');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sign out user / clear cookie
// @route   POST /api/auth/signout
// @access  Public / Protected
exports.signout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'strict',
  });
  res.status(200).json({ success: true, message: 'Signed out successfully' });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Protected
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
