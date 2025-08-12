import { Link } from 'react-router-dom';

const Navbar = ({ isAdmin, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">Event Manager</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Events</Link>
          {isAdmin ? (
            <button onClick={onLogout} className="btn btn-logout">
              Logout
            </button>
          ) : (
            <Link to="/admin" className="btn btn-login">Admin Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;