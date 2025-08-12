import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import EventForm from './EventForm';

const AdminPanel = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('/api/events');
      setEvents(data);
    } catch (error) {
      toast.error('Failed to load events');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchEvents();
        toast.success('Event deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete event');
        if (error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          window.location.reload();
        }
      }
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  return (
    <div className="admin-panel">
      <h2>Admin Dashboard</h2> 
      <button onClick={() => setShowForm(true)} className="btn btn-add">
        Add New Event
      </button>

      {showForm && (
        <EventForm
          eventData={editingEvent || {}}
          onSubmit={async (formData) => {
            try {
              const token = localStorage.getItem('adminToken');
              const config = {
                headers: { Authorization: `Bearer ${token}` }
              };

              if (editingEvent) {
                await axios.put(`/api/events/${editingEvent._id}`, formData, config);
                toast.success('Event updated successfully');
              } else {
                await axios.post('/api/events', formData, config);
                toast.success('Event created successfully');
              }
              setShowForm(false);
              setEditingEvent(null);
              fetchEvents();
            } catch (error) {
              toast.error(error.response?.data?.message || 'Operation failed');
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
        />
      )}

      <div className="events-list">
        {events.map(event => (
          <div key={event._id} className="admin-event-card">
            <h3>{event.title}</h3>
            <p>{new Date(event.date).toLocaleString()}</p>
            <div className="admin-actions">
              <button 
                onClick={() => {
                  setEditingEvent(event);
                  setShowForm(true);
                }} 
                className="btn btn-edit"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(event._id)} 
                className="btn btn-delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;