import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminPanel from '../components/AdminPanel';
import Login from '../components/Login';

const AdminPage = ({ onLogin }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('adminToken')
  );
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    onLogin();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="admin-page">
      {isAuthenticated ? (
        <AdminPanel />
      ) : (
        <Login onLogin={handleLoginSuccess} />
      )}
    </div>
  );
};

export default AdminPage;