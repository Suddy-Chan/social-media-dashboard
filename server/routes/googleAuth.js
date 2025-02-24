const express = require('express');
const router = express.Router();
const passport = require('../config/googleConfig');
const jwt = require('jsonwebtoken');

// Initialize Google OAuth login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { user: { id: req.user.id } },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Redirect to frontend with token
      res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
    } catch (error) {
      res.redirect('http://localhost:3000/login?error=google_auth_failed');
    }
  }
);

module.exports = router; 