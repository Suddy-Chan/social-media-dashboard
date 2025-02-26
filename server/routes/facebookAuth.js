const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const auth = require('../middleware/auth');
const facebookConfig = require('../config/facebookConfig');

// Initialize Facebook connection
router.get('/facebook/connect', auth, (req, res) => {
  try {
    console.log('Auth middleware user:', req.user);
    const state = req.user.id;
    
    const authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth');
    const params = new URLSearchParams({
      client_id: facebookConfig.appId,
      redirect_uri: facebookConfig.callbackURL,
      state: state,
      scope: 'email,public_profile'
    });

    authUrl.search = params.toString();
    console.log('Generated Facebook URL:', authUrl.toString());
    res.json({ authUrl: authUrl.toString() });
  } catch (error) {
    console.error('Facebook Auth Error:', error);
    res.status(500).json({ msg: 'Failed to initialize Facebook authentication' });
  }
});

// Facebook callback route
router.get('/facebook/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      console.error('OAuth Error:', error);
      return res.redirect('http://localhost:3000/connect?error=facebook_connection_failed');
    }

    if (!code) {
      throw new Error('No authorization code received from Facebook');
    }

    console.log('Received code from Facebook, exchanging for token...');
    
    // Exchange code for access token
    const tokenResponse = await axios.get(
      'https://graph.facebook.com/v18.0/oauth/access_token',
      {
        params: {
          client_id: facebookConfig.appId,
          client_secret: facebookConfig.appSecret,
          redirect_uri: facebookConfig.callbackURL,
          code
        }
      }
    );

    const { access_token } = tokenResponse.data;
    console.log('Received access token from Facebook');

    // Get user's Facebook profile
    console.log('Fetching Facebook user profile...');
    const profileResponse = await axios.get('https://graph.facebook.com/me', {
      params: {
        access_token,
        fields: 'id,name'
      }
    });

    console.log('Facebook profile received:', profileResponse.data.name);

    // Update user's record using state (user ID) from the OAuth flow
    console.log('Updating user record with Facebook data, user ID:', state);
    await User.findByIdAndUpdate(state, {
      facebookAccessToken: access_token,
      facebookUserId: profileResponse.data.id,
      facebookName: profileResponse.data.name
    });

    console.log('User record updated successfully');
    
    // Redirect to dashboard with success message
    res.redirect('http://localhost:3000/dashboard?success=true');
  } catch (error) {
    console.error('Facebook Callback Error:', error);
    res.redirect('http://localhost:3000/connect?error=facebook_connection_failed');
  }
});

// Add this route to check if Facebook is properly configured
router.get('/facebook/status', (req, res) => {
  const isConfigured = 
    facebookConfig.appId !== 'YOUR_FACEBOOK_APP_ID_HERE' && 
    facebookConfig.appSecret !== 'YOUR_FACEBOOK_APP_SECRET_HERE';
  
  res.json({ configured: isConfigured });
});

module.exports = router; 