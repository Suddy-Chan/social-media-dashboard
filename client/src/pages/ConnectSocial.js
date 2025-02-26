import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ConnectSocial.css';

const ConnectSocial = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(searchParams.get('error'));
  const [isConnecting, setIsConnecting] = useState(false);
  const [facebookConfigured, setFacebookConfigured] = useState(true);

  useEffect(() => {
    // Check if Facebook is properly configured
    const checkFacebookConfig = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/facebook/status');
        setFacebookConfigured(response.data.configured);
      } catch (err) {
        console.error('Failed to check Facebook configuration:', err);
        setFacebookConfigured(false);
      }
    };
    
    checkFacebookConfig();
  }, []);

  const handleXConnect = async () => {
    try {
      setIsConnecting(true);
      const token = localStorage.getItem('token');
      console.log('Token being sent:', token);
      const response = await axios.get('http://localhost:5000/api/auth/x/connect', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.authUrl) {
        console.log('Redirecting to:', response.data.authUrl);
        window.location.href = response.data.authUrl;
      } else {
        console.error('Invalid response:', response.data);
        setError('Invalid response from server');
        setIsConnecting(false);
      }
    } catch (err) {
      console.error('X connection error:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to connect to X');
      setIsConnecting(false);
    }
  };

  const handleFacebookConnect = async () => {
    if (!facebookConfigured) {
      setError('Facebook integration is not properly configured. Please contact support.');
      return;
    }
    
    try {
      setIsConnecting(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/facebook/connect', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.authUrl) {
        console.log('Redirecting to Facebook:', response.data.authUrl);
        window.location.href = response.data.authUrl;
      } else {
        console.error('Invalid Facebook response:', response.data);
        setError('Invalid response from server');
        setIsConnecting(false);
      }
    } catch (err) {
      console.error('Facebook connection error:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to connect to Facebook');
      setIsConnecting(false);
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
            : error === 'facebook_connection_failed'
            ? 'Failed to connect to Facebook. Please try again.'
            : error}
        </div>
      )}

      <div className="platforms-grid">
        <div className="platform-card">
          <div className="platform-icon x-icon">𝕏</div>
          <h3>X (Twitter)</h3>
          <p>Connect your X account to track followers, engagement, and posts</p>
          <button 
            onClick={handleXConnect} 
            className="connect-button"
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect X Account'}
          </button>
        </div>

        <div className="platform-card">
          <div className="platform-icon facebook-icon">f</div>
          <h3>Facebook</h3>
          <p>Connect your Facebook account to track page likes, reach, and engagement</p>
          {facebookConfigured ? (
            <button 
              onClick={handleFacebookConnect} 
              className="connect-button facebook-connect"
              disabled={isConnecting}
            >
              Connect Facebook
            </button>
          ) : (
            <button 
              className="connect-button disabled"
              disabled={true}
            >
              Coming Soon
            </button>
          )}
        </div>
      </div>

      <button onClick={skipConnection} className="skip-button">
        Skip for now
      </button>
    </div>
  );
};

export default ConnectSocial; 