import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import UserMenu from '../UserMenu/UserMenu';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    console.log('Success param:', searchParams.get('success'));
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      // Hide success message after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const metrics = {
    followers: '10.5K',
    engagement: '4.8',
    posts: { length: 156 }
  };

  const chartData = [
    { month: 'Jan', value: 60, amount: '6.0K' },
    { month: 'Feb', value: 80, amount: '8.0K' },
    { month: 'Mar', value: 40, amount: '4.0K' },
    { month: 'Apr', value: 90, amount: '9.0K' },
    { month: 'May', value: 70, amount: '7.0K' }
  ];

  return (
    <div className="dashboard">
      {showSuccess && (
        <div className="success-notification">
          Successfully connected to X account!
        </div>
      )}
      
      <nav className="dashboard-nav">
        <h1>Dashboard</h1>
        <UserMenu />
      </nav>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Followers</h3>
          <p className="metric-value">{metrics.followers}</p>
          <p className="metric-trend positive">+5.2% this week</p>
        </div>
        <div className="metric-card">
          <h3>Engagement Rate</h3>
          <p className="metric-value">{metrics.engagement}%</p>
          <p className="metric-trend positive">+2.1% this week</p>
        </div>
        <div className="metric-card">
          <h3>Total Posts</h3>
          <p className="metric-value">{metrics.posts.length}</p>
          <p className="metric-trend">This week</p>
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
                <div className="chart-value">{data.amount}</div>
                <div className="chart-bar" style={{ height: `${data.value}%` }}></div>
                <div className="chart-label">{data.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recent-posts">
        <h2>Recent Posts</h2>
        <div className="posts-grid">
          {/* Add logic to fetch and display recent posts */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 