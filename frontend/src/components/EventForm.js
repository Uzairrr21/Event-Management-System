import { useState } from 'react';
import { toast } from 'react-toastify';

const EventForm = ({ eventData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: eventData?.title || '',
    description: eventData?.description || '',
    date: eventData?.date ? new Date(eventData.date).toISOString().slice(0, 16) : '',
    location: eventData?.location || '',
    maxParticipants: eventData?.maxParticipants || 50
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxParticipants' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.date || !formData.location) {
      toast.error('Please fill all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="form-overlay">
      <div className="event-form-container">
        <h2>{eventData?._id ? 'Edit Event' : 'Create New Event'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the event"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date & Time *</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Event venue"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Maximum Participants *</label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn cancel-btn">
              Cancel
            </button>
            <button type="submit" className="btn submit-btn">
              {eventData?._id ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;