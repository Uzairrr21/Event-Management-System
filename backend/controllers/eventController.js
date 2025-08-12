const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Public
exports.registerForEvent = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email exists and has proper format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Find event and update in one operation to prevent race conditions
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: req.params.id,
        registeredParticipants: { 
          $not: { $elemMatch: { $regex: new RegExp(email, 'i') } }
        },
        $expr: { $lt: [{ $size: "$registeredParticipants" }, "$maxParticipants"] }
      },
      {
        $push: { registeredParticipants: email.toLowerCase() }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedEvent) {
      // Check which condition failed
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      const alreadyRegistered = event.registeredParticipants.some(
        p => p.toLowerCase() === email.toLowerCase()
      );
      
      if (alreadyRegistered) {
        return res.status(400).json({ message: 'This email is already registered for the event' });
      }

      if (event.registeredParticipants.length >= event.maxParticipants) {
        return res.status(400).json({ message: 'Event has reached maximum capacity' });
      }

      return res.status(400).json({ message: 'Registration failed for unknown reason' });
    }

    res.json({ 
      success: true,
      message: 'Registration successful',
      registeredEmail: email,
      remainingSpots: updatedEvent.maxParticipants - updatedEvent.registeredParticipants.length,
      event: updatedEvent
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed. Please try again.',
      error: err.message 
    });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, maxParticipants } = req.body;

    // Validate required fields
    if (!title || !description || !date || !location || !maxParticipants) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const event = new Event({
      title,
      description,
      date: new Date(date),
      location,
      maxParticipants: Number(maxParticipants)
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res) => {
  try {
    const { title, description, date, location, maxParticipants } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update only provided fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = new Date(date);
    if (location) event.location = location;
    if (maxParticipants) event.maxParticipants = Number(maxParticipants);

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    
    if (!deletedEvent) {
      return res.status(404).json({ 
        success: false,
        message: 'Event not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Event deleted successfully',
      deletedEvent
    });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete event',
      error: err.message 
    });
  }
};