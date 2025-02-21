import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const maxValue = 10000; // 10K
  const chartData = [
    { month: 'Jan', value: 6000, amount: '6.0K' },
    { month: 'Feb', value: 8000, amount: '8.0K' },
    { month: 'Mar', value: 4000, amount: '4.0K' },
    { month: 'Apr', value: 9000, amount: '9.0K' },
    { month: 'May', value: 7000, amount: '7.0K' },
  ];

  const calculateHeight = (value) => {
    const height = (value / maxValue) * 100;
    return height.toFixed(2);
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="home-title">Social Media Dashboard</h1>
        <p className="subtitle">Track your social media performance in one place</p>
        <div className="auth-buttons">
          <Link to="/register" className="auth-button register-button">
            Register
          </Link>
          <Link to="/login" className="auth-button login-button">
            Login
          </Link>
        </div>
      </section>

      <section className="demo-section">
        <h2>Dashboard Preview</h2>
        <div className="demo-dashboard">
          <div className="demo-metrics">
            <div className="demo-card">
              <h3>Followers</h3>
              <p className="metric-value">10.5K</p>
              <span className="metric-trend positive">+12%</span>
            </div>
            <div className="demo-card">
              <h3>Engagement Rate</h3>
              <p className="metric-value">4.8%</p>
              <span className="metric-trend positive">+2.4%</span>
            </div>
            <div className="demo-card">
              <h3>Total Posts</h3>
              <p className="metric-value">156</p>
              <span className="metric-trend">This Month</span>
            </div>
          </div>

          <div className="demo-chart">
            <h3>Monthly Follower Growth</h3>
            <div className="chart-container">
              <div className="y-axis">
                <span>10K</span>
                <span>7.5K</span>
                <span>5K</span>
                <span>2.5K</span>
                <span>0</span>
              </div>
              <div className="chart-placeholder">
                {chartData.map((data, index) => (
                  <div className="chart-column" key={index}>
                    <div 
                      className="chart-bar" 
                      style={{ 
                        height: `${calculateHeight(data.value)}%`
                      }}
                    >
                      <div className="chart-value">{data.amount}</div>
                    </div>
                    <div className="chart-label">{data.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 