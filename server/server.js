const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const xAuthRoutes = require('./routes/xAuth');
const dashboardRoutes = require('./routes/dashboard');
const googleAuthRoutes = require('./routes/googleAuth');
const profileRoutes = require('./routes/profile');
const passport = require('passport');
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', xAuthRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});