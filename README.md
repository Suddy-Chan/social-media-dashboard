# Social Media Dashboard

A full-stack web application that allows users to track their social media metrics across different platforms. Currently supports X (Twitter) integration with more platforms coming soon.

## Features

- User authentication (register/login)
- Social media platform connection
- Analytics dashboard with:
  - Follower metrics
  - Engagement rates
  - Post tracking
  - Visual data representation

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Prerequisites

Before running the application, make sure you have:

1. Node.js installed (v14 or higher)
2. MongoDB installed and running
3. X (Twitter) Developer Account with API credentials

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Suddy-Chan/social-media-dashboard.git
cd social-media-dashboard
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

## Configuration

1. Create a `.env` file in the server directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
X_CLIENT_ID=your_twitter_client_id
X_CLIENT_SECRET=your_twitter_client_secret
PORT=5000
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```
The server will run on `http://localhost:5000`

2. Start the frontend development server:
```bash
cd client
npm start
```
The client will run on `http://localhost:3000`

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── styles/       # CSS styles
│   │   └── App.js        # Main App component
│   └── public/           # Static files
└── server/               # Node.js backend
    ├── config/          # Configuration files
    ├── models/          # MongoDB models
    ├── routes/          # API routes
    └── server.js        # Server entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Environment Variables

For security reasons, environment variables are not committed to the repository. To run this project:

1. Copy `.env.example` to `.env` in the server directory:
```bash
cd server
cp .env.example .env
```

2. Update the `.env` file with your actual values:
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `X_CLIENT_ID`: X (Twitter) API client ID
- `X_CLIENT_SECRET`: X (Twitter) API client secret
- `FACEBOOK_APP_ID`: Facebook App ID
- `FACEBOOK_APP_SECRET`: Facebook App Secret

**Note:** Never commit your actual `.env` file or expose your API keys publicly.
