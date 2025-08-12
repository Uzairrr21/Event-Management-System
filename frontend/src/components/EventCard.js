import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const isFull = event.registeredParticipants.length >= event.maxParticipants;

  return (
    <div className={`event-card ${isFull ? 'card-disabled' : ''}`}>
      <div className="card-header">
        <h3>{event.title}</h3>
        <span className={`status-badge ${isFull ? 'full' : 'available'}`}>
          {isFull ? 'FULL' : 'AVAILABLE'}
        </span>
      </div>
      <div className="card-body">
        <p className="event-date">
          <i className="icon calendar"></i>
          {new Date(event.date).toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <p className="event-location">
          <i className="icon location"></i>
          {event.location}
        </p>
        <div className="progress-container">
          <div 
            className="progress-bar"
            style={{
              width: `${Math.min(
                100,
                (event.registeredParticipants.length / event.maxParticipants) * 100
              )}%`
            }}
          ></div>
          <span className="progress-text">
            {event.registeredParticipants.length}/{event.maxParticipants} spots filled
          </span>
        </div>
      </div>
      <div className="card-footer">
        <Link 
          to={`/event/${event._id}`} 
          className={`btn ${isFull ? 'disabled' : ''}`}
        >
          {isFull ? 'View Details' : 'Register Now'}
        </Link>
      </div>
    </div>
  );
};

export default EventCard;