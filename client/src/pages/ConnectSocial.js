import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ConnectSocial.css';

const ConnectSocial = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(searchParams.get('error'));

  const handleXConnect = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/x', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Redirect to X's OAuth page
      window.location.href = response.data.authUrl;
    } catch (err) {
      setError('Failed to connect to X');
    }
  };

  const skipConnection = () => {
    navigate('/dashboard');
  };

  return (
    <div className="connect-container">
      <h1>Connect Your Social Media</h1>
      <p className="connect-description">
        Connect your social media accounts to view your analytics dashboard
      </p>

      {error && (
        <div className="error-message">
          {error === 'x_connection_failed' 
            ? 'Failed to connect to X. Please try again.' 
            : error}
        </div>
      )}

      <div className="platforms-grid">
        <div className="platform-card">
          <div className="platform-icon x-icon">𝕏</div>
          <h3>X (Twitter)</h3>
          <p>Connect your X account to track followers, engagement, and posts</p>
          <button onClick={handleXConnect} className="connect-button">
            Connect X Account
          </button>
        </div>

        <div className="platform-card disabled">
          <div className="platform-icon">
            <span className="coming-soon">Soon</span>
          </div>
          <h3>Instagram</h3>
          <p>Instagram integration coming soon</p>
          <button disabled className="connect-button disabled">
            Coming Soon
          </button>
        </div>
      </div>

      <button onClick={skipConnection} className="skip-button">
        Skip for now
      </button>
    </div>
  );
};

export default ConnectSocial; 