require('dotenv').config();

module.exports = {
  clientId: process.env.X_CLIENT_ID,
  clientSecret: process.env.X_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/auth/x/callback',
  scope: ['tweet.read', 'users.read', 'follows.read'],
}; 