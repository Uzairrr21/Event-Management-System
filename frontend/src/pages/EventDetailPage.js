import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`/api/events/${id}`);
        setEvent(data);
      } catch (error) {
        toast.error('Event not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/events/${id}/register`, { email });
      const updatedEvent = { ...event };
      updatedEvent.registeredParticipants.push(email);
      setEvent(updatedEvent);
      toast.success('Registered successfully!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  if (loading) return <div className="loading">Loading event details...</div>;
  if (!event) return null;

  const isFull = event.registeredParticipants.length >= event.maxParticipants;

  return (
    <div className="event-detail">
      <h1>{event.title}</h1>
      <p className="event-meta">
        📅 {new Date(event.date).toLocaleString()} | 📍 {event.location}
      </p>
      
      <div className="event-description">
        <h3>About This Event</h3>
        <p>{event.description}</p>
      </div>

      <div className="event-stats">
        <p>
          <span className={isFull ? 'text-danger' : ''}>
            {event.registeredParticipants.length}/{event.maxParticipants} participants
          </span>
          {isFull && <span className="badge-full">FULL</span>}
        </p>
      </div>

      {!isFull && (
        <form onSubmit={handleRegister} className="registration-form">
          <h3>Register Now</h3>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn">
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default EventDetailPage;