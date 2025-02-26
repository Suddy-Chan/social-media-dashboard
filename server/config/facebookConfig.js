module.exports = {
  appId: process.env.FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID_HERE',
  appSecret: process.env.FACEBOOK_APP_SECRET || 'YOUR_FACEBOOK_APP_SECRET_HERE',
  callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:5000/api/auth/facebook/callback'
}; 