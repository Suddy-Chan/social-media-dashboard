import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import UserMenu from '../UserMenu/UserMenu';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [xData, setXData] = useState(null);
  const [facebookData, setFacebookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isDemoData, setIsDemoData] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const xSectionRef = useRef(null);
  const facebookSectionRef = useRef(null);

  // Demo data for X
  const xDemoData = {
    profile: {
      name: "Demo User",
      username: "demouser"
    },
    tweets: [
      {
        id: "demo1",
        text: "This is a demo tweet showing what your dashboard will look like when connected to X.",
        created_at: new Date().toISOString(),
        public_metrics: {
          like_count: 42,
          retweet_count: 12,
          reply_count: 7
        }
      },
      {
        id: "demo2",
        text: "Connect your X account to see your real tweets and engagement metrics here!",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        public_metrics: {
          like_count: 24,
          retweet_count: 8,
          reply_count: 3
        }
      }
    ],
    metrics: {
      followers: 1234,
      following: 567,
      tweets: 890
    }
  };

  // Demo data for Facebook
  const facebookDemoData = {
    profile: {
      name: "Demo User",
      id: "12345678"
    },
    posts: [
      {
        id: "fb_demo1",
        message: "This is a demo Facebook post showing what your dashboard will look like when connected.",
        created_time: new Date().toISOString(),
        likes: 87,
        comments: 14,
        shares: 5
      },
      {
        id: "fb_demo2",
        message: "Connect your Facebook account to see your real posts and engagement metrics here!",
        created_time: new Date(Date.now() - 86400000).toISOString(),
        likes: 45,
        comments: 8,
        shares: 2
      }
    ],
    metrics: {
      page_likes: 2345,
      page_views: 789,
      post_reach: 5678
    }
  };

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchXData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching X data with token:', token ? 'Token exists' : 'No token');
        const response = await axios.get('http://localhost:5000/api/x', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setXData(response.data);
        setIsRateLimited(response.data.rateLimited || false);
        setIsDemoData(false);
      } catch (err) {
        console.error('Failed to fetch X data:', err);
        
        // Try to get cached data if available
        try {
          const token = localStorage.getItem('token');
          const cachedResponse = await axios.get('http://localhost:5000/api/x/cached', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          setXData(cachedResponse.data);
          setIsRateLimited(true);
          setIsDemoData(false);
        } catch (cacheErr) {
          console.error('No cached X data available:', cacheErr);
          // Use demo data as fallback
          setXData(xDemoData);
          setIsDemoData(true);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchFacebookData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching Facebook data with token:', token ? 'Token exists' : 'No token');
        const response = await axios.get('http://localhost:5000/api/facebook', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setFacebookData(response.data);
      } catch (err) {
        console.error('Failed to fetch Facebook data:', err);
        // Use demo data as fallback for development
        setFacebookData(facebookDemoData);
      }
    };

    fetchXData();
    fetchFacebookData();
  }, []);

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  // Calculate engagement rate for X
  const calculateEngagement = (tweets) => {
    if (!tweets || tweets.length === 0) return '0.0';
    
    let totalEngagement = 0;
    tweets.forEach(tweet => {
      const metrics = tweet.public_metrics;
      totalEngagement += (metrics.like_count + metrics.retweet_count + metrics.reply_count);
    });
    
    return (totalEngagement / tweets.length).toFixed(1);
  };

  // Calculate Facebook engagement rate
  const calculateFacebookEngagement = (posts) => {
    if (!posts || posts.length === 0) return '0.0';
    
    let totalEngagement = 0;
    posts.forEach(post => {
      totalEngagement += (post.likes + post.comments + post.shares);
    });
    
    return (totalEngagement / posts.length).toFixed(1);
  };

  const checkXStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/x/status', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('X connection status:', response.data);
      
      if (!response.data.connected) {
        setError('X account not connected. Please connect your X account.');
      } else {
        alert(`Connected as @${response.data.username}`);
      }
    } catch (err) {
      console.error('Failed to check X status:', err);
    }
  };

  const scrollToSection = (section) => {
    if (section === 'x' && xSectionRef.current) {
      xSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      setActiveTab('x');
    } else if (section === 'facebook' && facebookSectionRef.current) {
      facebookSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      setActiveTab('facebook');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveTab('all');
    }
  };

  return (
    <div className="dashboard">
      {showSuccess && (
        <div className="success-notification">
          Successfully connected to social account!
        </div>
      )}
      
      <nav className="dashboard-nav">
        <h1>Dashboard</h1>
        <UserMenu />
      </nav>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => scrollToSection('all')}
        >
          All Platforms
        </button>
        <button 
          className={`tab-button x-tab ${activeTab === 'x' ? 'active' : ''}`}
          onClick={() => scrollToSection('x')}
        >
          X (Twitter)
        </button>
        <button 
          className={`tab-button facebook-tab ${activeTab === 'facebook' ? 'active' : ''}`}
          onClick={() => scrollToSection('facebook')}
        >
          Facebook
        </button>
      </div>

      {isRateLimited && (
        <div className="rate-limit-warning">
          Twitter API rate limit reached. Showing cached data.
        </div>
      )}

      {isDemoData && (
        <div className="demo-data-notice">
          Showing demo data. Connect your accounts to see your real analytics.
        </div>
      )}

      <div className="dashboard-sections">
        {/* X Section - Always on top */}
        <section ref={xSectionRef} className="dashboard-section x-section" id="x-section">
          <h2>X (Twitter) Analytics</h2>
          
          {loading ? (
            <div className="loading">Loading X data...</div>
          ) : xData ? (
            <>
              <div className="profile-header">
                <h3>@{xData.profile.username}</h3>
              </div>
              
              <div className="metrics-grid">
                <div className="metric-card">
                  <h3>Followers</h3>
                  <p className="metric-value">{formatNumber(xData.metrics.followers)}</p>
                </div>
                
                <div className="metric-card">
                  <h3>Engagement</h3>
                  <p className="metric-value">{calculateEngagement(xData.tweets)}</p>
                </div>
                
                <div className="metric-card">
                  <h3>Total Tweets</h3>
                  <p className="metric-value">{formatNumber(xData.metrics.tweets)}</p>
                </div>
              </div>

              <div className="recent-tweets">
                <h3>Recent Tweets</h3>
                {xData.tweets && xData.tweets.length > 0 ? (
                  <div className="tweets-list">
                    {xData.tweets.map(tweet => (
                      <div key={tweet.id} className="tweet-card">
                        <p>{tweet.text}</p>
                        <div className="tweet-metrics">
                          <span>❤️ {tweet.public_metrics.like_count}</span>
                          <span>🔄 {tweet.public_metrics.retweet_count}</span>
                          <span>💬 {tweet.public_metrics.reply_count}</span>
                          <span className="tweet-date">
                            {new Date(tweet.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No recent tweets found.</p>
                )}
              </div>
            </>
          ) : (
            <div className="connect-prompt">
              <p>Connect your X account to see your analytics.</p>
              <a href="/connect" className="connect-button">Connect X Account</a>
            </div>
          )}
        </section>

        {/* Facebook Section - Always on bottom */}
        <section ref={facebookSectionRef} className="dashboard-section facebook-section" id="facebook-section">
          <h2>Facebook Analytics</h2>
          
          {facebookData ? (
            <>
              <div className="profile-header">
                <h3>{facebookData.profile.name}</h3>
              </div>
              
              <div className="metrics-grid">
                <div className="metric-card">
                  <h3>Page Likes</h3>
                  <p className="metric-value">{formatNumber(facebookData.metrics.page_likes)}</p>
                </div>
                
                <div className="metric-card">
                  <h3>Engagement</h3>
                  <p className="metric-value">{calculateFacebookEngagement(facebookData.posts)}</p>
                </div>
                
                <div className="metric-card">
                  <h3>Page Views</h3>
                  <p className="metric-value">{formatNumber(facebookData.metrics.page_views)}</p>
                </div>
              </div>

              <div className="recent-posts">
                <h3>Recent Posts</h3>
                {facebookData.posts && facebookData.posts.length > 0 ? (
                  <div className="posts-list">
                    {facebookData.posts.map(post => (
                      <div key={post.id} className="post-card">
                        <p>{post.message}</p>
                        <div className="post-metrics">
                          <span>👍 {post.likes}</span>
                          <span>💬 {post.comments}</span>
                          <span>🔄 {post.shares}</span>
                          <span className="post-date">
                            {new Date(post.created_time).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No recent posts found.</p>
                )}
              </div>
            </>
          ) : (
            <div className="connect-prompt">
              <p>Connect your Facebook account to see your analytics.</p>
              <a href="/connect" className="connect-button facebook-connect">Connect Facebook</a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard; 