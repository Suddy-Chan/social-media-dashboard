const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Simple in-memory cache
const cache = {
  data: {},
  timestamps: {}
};

// Cache TTL in milliseconds (10 minutes)
const CACHE_TTL = 10 * 60 * 1000;

// Get user's X data
router.get('/', auth, async (req, res) => {
  try {
    // Get user from database
    const user = await User.findById(req.user.id);
    console.log('User X data:', {
      hasToken: !!user.xAccessToken,
      hasUserId: !!user.xUserId,
      userId: user.id,
      xUserId: user.xUserId
    });
    
    if (!user.xAccessToken || !user.xUserId) {
      return res.status(400).json({ msg: 'X account not connected' });
    }
    
    // Check cache first
    const cacheKey = `x_data_${user.id}`;
    const now = Date.now();
    if (cache.data[cacheKey] && (now - cache.timestamps[cacheKey] < CACHE_TTL)) {
      console.log('Returning cached X data');
      return res.json(cache.data[cacheKey]);
    }
    
    // Fetch user's X profile data
    console.log('Fetching X profile for user ID:', user.xUserId);
    try {
      const profileResponse = await axios.get(`https://api.twitter.com/2/users/${user.xUserId}?user.fields=public_metrics`, {
        headers: {
          'Authorization': `Bearer ${user.xAccessToken}`
        }
      });
      console.log('Profile response received');
      
      // Fetch user's recent tweets
      console.log('Fetching recent tweets');
      const tweetsResponse = await axios.get(
        `https://api.twitter.com/2/users/${user.xUserId}/tweets?max_results=5&tweet.fields=public_metrics,created_at`, {
          headers: {
            'Authorization': `Bearer ${user.xAccessToken}`
          }
        }
      );
      console.log('Tweets response received');
      
      // Prepare data for frontend
      const userData = {
        profile: profileResponse.data.data,
        tweets: tweetsResponse.data.data || [],
        metrics: {
          followers: profileResponse.data.data.public_metrics.followers_count,
          following: profileResponse.data.data.public_metrics.following_count,
          tweets: profileResponse.data.data.public_metrics.tweet_count
        }
      };
      
      // Cache the data
      cache.data[cacheKey] = userData;
      cache.timestamps[cacheKey] = now;
      
      res.json(userData);
    } catch (apiError) {
      console.error('X API Error:', apiError.response?.data || apiError.message);
      
      // Check if rate limited
      if (apiError.response?.status === 429) {
        // Try to return cached data if available
        if (cache.data[cacheKey]) {
          console.log('Rate limited, returning cached data');
          return res.json({
            ...cache.data[cacheKey],
            rateLimited: true
          });
        }
        
        return res.status(429).json({ 
          msg: 'Twitter API rate limit exceeded. Please try again later.',
          details: apiError.response.data
        });
      }
      
      // Check if token is expired or invalid
      if (apiError.response?.status === 401) {
        return res.status(401).json({ 
          msg: 'X token expired or invalid. Please reconnect your X account.',
          details: apiError.response.data
        });
      }
      
      throw apiError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error('X Data Error:', error.response?.data || error.message || error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      msg: 'Failed to fetch X data',
      details: error.response?.data || error.message 
    });
  }
});

// Check X connection status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      connected: !!(user.xAccessToken && user.xUserId),
      username: user.xUsername || null,
      userId: user.xUserId || null,
      hasToken: !!user.xAccessToken
    });
  } catch (error) {
    console.error('X Status Error:', error);
    res.status(500).json({ msg: 'Failed to check X connection status' });
  }
});

// Get cached X data
router.get('/cached', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.xAccessToken || !user.xUserId) {
      return res.status(400).json({ msg: 'X account not connected' });
    }
    
    const cacheKey = `x_data_${user.id}`;
    
    if (cache.data[cacheKey]) {
      console.log('Returning cached X data');
      return res.json({
        ...cache.data[cacheKey],
        rateLimited: true
      });
    } else {
      return res.status(404).json({ msg: 'No cached data available' });
    }
  } catch (error) {
    console.error('Cached X Data Error:', error);
    res.status(500).json({ msg: 'Failed to fetch cached X data' });
  }
});

module.exports = router; 