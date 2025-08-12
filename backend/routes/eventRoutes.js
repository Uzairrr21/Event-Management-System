const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  registerForEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(getEvents).post(protect, createEvent);
router.route('/:id').get(getEvent).put(protect, updateEvent).delete(protect, deleteEvent);
router.route('/:id/register').post(registerForEvent);

module.exports = router;