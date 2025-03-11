import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../hooks/useTheme';
import '../styles/Settings.css'; // We'll need to create this CSS file

const Settings = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    dataRefreshInterval: 30,
    defaultDashboardView: 'all',
    language: 'en',
    compactView: false,
    autoLogout: 60
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      // You'll need to implement this API endpoint on your server
      const response = await axios.get('http://localhost:5000/api/settings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // If the endpoint doesn't exist yet, this will use the default values
      if (response.data) {
        setSettings(response.data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      // Continue with default settings if the endpoint doesn't exist yet
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    try {
      const token = localStorage.getItem('token');
      // You'll need to implement this API endpoint on your server
      await axios.put('http://localhost:5000/api/settings', settings, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Failed to update settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  if (loading) {
    return <div className="settings-container loading-state">Loading...</div>;
  }

  return (
    <div className="settings-container">
      <nav className="settings-nav">
        <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
        <h1>Settings</h1>
      </nav>
      
      <div className="settings-content">
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-section">
            <h3><span className="section-icon">🎨</span>Appearance</h3>
            <div className="setting-item">
              <label className="toggle-label">
                <span>Dark Mode</span>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    name="darkMode"
                    checked={darkMode}
                    onChange={handleDarkModeToggle}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
              <p className="setting-description">Enable dark mode for a more comfortable viewing experience in low light.</p>
            </div>
            
            <div className="setting-item">
              <label className="toggle-label">
                <span>Compact View</span>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    name="compactView"
                    checked={settings.compactView}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
              <p className="setting-description">Display more content with less spacing for a compact dashboard view.</p>
            </div>
            
            <div className="setting-item">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                name="language"
                value={settings.language}
                onChange={handleInputChange}
                className="select-input"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
              <p className="setting-description">Select your preferred language for the application interface.</p>
            </div>
          </div>

          <div className="settings-section">
            <h3><span className="section-icon">🔔</span>Notifications</h3>
            <div className="setting-item">
              <label className="toggle-label">
                <span>Email Notifications</span>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
              <p className="setting-description">Receive email notifications about important updates and activity on your social accounts.</p>
            </div>
            
            <div className="setting-item">
              <label className="toggle-label">
                <span>Push Notifications</span>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    name="pushNotifications"
                    checked={settings.pushNotifications}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
              <p className="setting-description">Receive browser push notifications for real-time updates and engagement alerts.</p>
            </div>
          </div>

          <div className="settings-section">
            <h3><span className="section-icon">📊</span>Dashboard Preferences</h3>
            <div className="setting-item">
              <label htmlFor="dataRefreshInterval">Data Refresh Interval (minutes)</label>
              <input
                type="number"
                id="dataRefreshInterval"
                name="dataRefreshInterval"
                min="5"
                max="120"
                value={settings.dataRefreshInterval}
                onChange={handleInputChange}
                className="number-input"
              />
              <p className="setting-description">How often your dashboard data should automatically refresh. Lower values provide more up-to-date information but may use more data.</p>
            </div>
            
            <div className="setting-item">
              <label htmlFor="defaultDashboardView">Default Dashboard View</label>
              <select
                id="defaultDashboardView"
                name="defaultDashboardView"
                value={settings.defaultDashboardView}
                onChange={handleInputChange}
                className="select-input"
              >
                <option value="all">All Platforms</option>
                <option value="x">X (Twitter)</option>
                <option value="facebook">Facebook</option>
              </select>
              <p className="setting-description">Which view to show by default when you open the dashboard.</p>
            </div>
          </div>

          <div className="settings-section">
            <h3><span className="section-icon">🔒</span>Security</h3>
            <div className="setting-item">
              <label htmlFor="autoLogout">Auto Logout (minutes)</label>
              <input
                type="number"
                id="autoLogout"
                name="autoLogout"
                min="5"
                max="240"
                value={settings.autoLogout}
                onChange={handleInputChange}
                className="number-input"
              />
              <p className="setting-description">Automatically log out after this period of inactivity. Set to 0 to disable auto logout.</p>
            </div>
          </div>

          <div className="settings-actions">
            <button 
              type="submit" 
              className={`save-button ${saveStatus === 'saving' ? 'saving' : ''}`}
            >
              {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
            </button>
            
            {saveStatus === 'success' && (
              <span className="save-status success">Settings saved successfully!</span>
            )}
            
            {saveStatus === 'error' && (
              <span className="save-status error">Failed to save settings. Please try again.</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings; 