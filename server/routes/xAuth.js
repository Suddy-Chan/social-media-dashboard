const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const auth = require('../middleware/auth');
const xConfig = require('../config/xConfig');

// Initialize X connection
router.get('/x/connect', auth, (req, res) => {
  try {
    console.log('Auth middleware user:', req.user);
    const state = req.user.id;
    const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: xConfig.clientId,
      redirect_uri: xConfig.callbackURL,
      scope: xConfig.scope.join(' '),
      state: state,
      code_challenge: 'challenge',
      code_challenge_method: 'plain'
    });

    authUrl.search = params.toString();
    console.log('Generated URL:', authUrl.toString());
    res.json({ authUrl: authUrl.toString() });
  } catch (error) {
    console.error('X Auth Error:', error);
    res.status(500).json({ msg: 'Failed to initialize X authentication' });
  }
});

// Remove auth middleware from callback route
router.get('/x/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      console.error('OAuth Error:', error);
      return res.redirect('http://localhost:3000/connect?error=' + error);
    }

    if (!code) {
      throw new Error('No authorization code received from X');
    }

    // Exchange code for access token with Basic Auth header
    const basicAuth = Buffer.from(`${xConfig.clientId}:${xConfig.clientSecret}`).toString('base64');
    const tokenResponse = await axios.post('https://api.twitter.com/2/oauth2/token',
      new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: xConfig.clientId,
        redirect_uri: xConfig.callbackURL,
        code_verifier: 'challenge'
      }), {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token } = tokenResponse.data;

    // Get user's X profile
    const profileResponse = await axios.get('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    // Update user's record using state (user ID) from the OAuth flow
    await User.findByIdAndUpdate(state, {
      xAccessToken: access_token,
      xUserId: profileResponse.data.data.id,
      xUsername: profileResponse.data.data.username
    });

    // Redirect to dashboard with success message
    res.redirect('http://localhost:3000/dashboard?success=true');
  } catch (error) {
    console.error('X Callback Error:', error.response?.data || error);
    res.redirect('http://localhost:3000/connect?error=x_connection_failed');
  }
});

module.exports = router; 