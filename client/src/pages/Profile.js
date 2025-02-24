import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import XIcon from '../components/icons/XIcon';
import '../styles/Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    avatar: null
  });
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setProfileData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleEditToggle = (e) => {
    e.preventDefault(); // Prevent any default button behavior
    setIsEditing(!isEditing);
    if (isEditing) {
      setPreviewAvatar(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('username', profileData.username);
      if (previewAvatar) {
        formData.append('avatar', document.querySelector('input[type="file"]').files[0]);
      }

      await axios.put('http://localhost:5000/api/profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setIsEditing(false);
      fetchUserProfile(); // Refresh profile data after update
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="profile-container loading-state">Loading...</div>;
  }

  if (error) {
    return <div className="profile-container error-state">Error: {error}</div>;
  }

  return (
    <div className="profile-container">
      <nav className="profile-nav">
        <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
        <h1>My Profile</h1>
      </nav>
      
      <div className="profile-content">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-header">
            <div className="avatar-section">
              <div className="profile-avatar">
                {previewAvatar ? (
                  <img src={previewAvatar} alt="Preview" className="avatar-preview" />
                ) : (
                  profileData.username?.charAt(0) || 'U'
                )}
              </div>
              {isEditing && (
                <div className="avatar-upload">
                  <label htmlFor="avatar" className="avatar-upload-button">
                    Change Avatar
                  </label>
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            <div className="profile-info">
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  className="edit-input"
                  placeholder="Username"
                />
              ) : (
                <h2>{profileData.username || 'Username'}</h2>
              )}
            </div>
          </div>

          <div className="profile-details">
            <h3>Account Information</h3>
            <div className="info-group">
              <label>Email</label>
              <p>{profileData.email}</p>
            </div>
            <div className="info-group">
              <label>Member Since</label>
              <p>{new Date(profileData.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="connected-accounts">
            <h3>Connected Accounts</h3>
            <div className="platform-connection">
              <div className="platform-info">
                <XIcon />
                <span>X (Twitter)</span>
              </div>
              <span className={`connection-status ${profileData.xUsername ? 'connected' : 'not-connected'}`}>
                {profileData.xUsername ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button type="submit" className="save-button">Save Changes</button>
                <button type="button" onClick={handleEditToggle} className="cancel-button">
                  Cancel
                </button>
              </>
            ) : (
              <button type="button" onClick={handleEditToggle} className="edit-button">
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile; 