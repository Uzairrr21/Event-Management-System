const express = require('express');
const router = express.Router();
const { authAdmin, getAdminProfile } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/login', authAdmin);
router.get('/profile', protect, getAdminProfile);

module.exports = router;