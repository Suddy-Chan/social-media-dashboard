import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserMenu.css';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="user-menu">
      <button 
        className={`avatar-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Click to open menu"
      >
        <div className="avatar">
          {/* Placeholder for user initial */}
          U
        </div>
        <span className="username">Username</span>
        <span className={`chevron ${isOpen ? 'up' : 'down'}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={handleProfileClick}>
            <span className="menu-icon">👤</span>
            My Profile
          </button>
          <button onClick={handleSettingsClick}>
            <span className="menu-icon">⚙️</span>
            Settings
          </button>
          <button onClick={handleLogout} className="logout-option">
            <span className="menu-icon">🚪</span>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 