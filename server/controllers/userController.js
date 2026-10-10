const User = require('../models/User');
const bcrypt = require('bcrypt');

// Helper to remove password from user object
const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  return userObj;
};

// @desc    Create User (CRUD - Create)
// @route   POST /api/users
// @access  Protected (admin, super only)
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const currentUserRole = req.user.role;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Username, email, and password are required' });
    }

    // Admin can only create 'user' accounts
    if (currentUserRole === 'admin' && (role === 'admin' || role === 'super')) {
      return res.status(403).json({
        message: 'Admins can only create accounts with the "user" role. Only Super Admins can create admin or super accounts.',
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email or username already exists' });
    }

    // Hash password directly in controller
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: sanitizeUser(savedUser),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get All Users (CRUD - Read All)
// @route   GET /api/users
// @access  Protected (admin, super only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get User By ID (CRUD - Read One)
// @route   GET /api/users/:id
// @access  Protected (admin, super only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update User (CRUD - Update)
// @route   PUT /api/users/:id
// @access  Protected (admin, super only)
exports.updateUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id.toString();
    const currentUserRole = req.user.role;
    const { username, email, password, role } = req.body;

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Role restrictions for Admin
    if (currentUserRole === 'admin') {
      // Admins cannot update Super accounts under any circumstances
      if (user.role === 'super') {
        return res.status(403).json({
          message: 'Admins are not allowed to update Super Admin accounts.',
        });
      }
      if (user.role !== 'user' && targetUserId !== currentUserId) {
        return res.status(403).json({
          message: 'Admins can only manage accounts with the "user" role.',
        });
      }
      if (role && role !== 'user' && role !== user.role) {
        return res.status(403).json({
          message: 'Only Super Admins can assign "admin" or "super" roles.',
        });
      }
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete User (CRUD - Delete)
// @route   DELETE /api/users/:id
// @access  Protected (admin, super only)
exports.deleteUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id.toString();
    const currentUserRole = req.user.role;

    // Rule 1: Cannot delete own self
    if (targetUserId === currentUserId) {
      return res
        .status(400)
        .json({ message: 'You cannot delete your own account' });
    }

    const userToDelete = await User.findById(targetUserId);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Rule 2: Admin can ONLY delete accounts with role 'user'
    if (currentUserRole === 'admin') {
      if (userToDelete.role !== 'user') {
        return res.status(403).json({
          message:
            'Admins can only delete accounts with the "user" role. Only Super Admins can delete admin or super accounts.',
        });
      }
    }

    // Rule 3: Super admin can delete any account (except self, enforced above)
    await User.findByIdAndDelete(targetUserId);

    res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
