const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// @desc    Authenticate admin
// @route   POST /api/admin/login
// @access  Public
exports.authAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      _id: admin._id,
      username: admin.username,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};