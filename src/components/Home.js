import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleTestReview = () => {
    // Navigate to review page with a random ID for testing
    const randomId = Math.floor(Math.random() * 200);
    navigate(`/review?id=${randomId}`);
  };

  const handleRandomReview = () => {
    navigate('/review');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="logo-section">
          <h1>Ansh Dental And Physio Care</h1>
          <p className="subtitle">Auto-Review System</p>
        </div>

        <div className="info-section">
          <div className="info-card">
            <div className="icon">📱</div>
            <h3>Scan QR Code</h3>
            <p>Customers scan a QR code to access the review page</p>
          </div>

          <div className="info-card">
            <div className="icon">📋</div>
            <h3>Auto-Copy Feedback</h3>
            <p>Feedback message is automatically copied to clipboard</p>
          </div>

          <div className="info-card">
            <div className="icon">⭐</div>
            <h3>Leave Review</h3>
            <p>Customer pastes feedback and submits review on Google</p>
          </div>
        </div>

        <div className="test-section">
          <h2>Test the System</h2>
          <p>Try the review flow with sample feedback</p>

          <div className="button-group">
            <button className="test-button primary" onClick={handleTestReview}>
              Test with Random Feedback
            </button>
            <button className="test-button secondary" onClick={handleRandomReview}>
              Test Random Selection
            </button>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat">
            <div className="stat-number">200</div>
            <div className="stat-label">Unique Feedback Messages</div>
          </div>
          <div className="stat">
            <div className="stat-number">3</div>
            <div className="stat-label">Simple Steps</div>
          </div>
          <div className="stat">
            <div className="stat-number">100%</div>
            <div className="stat-label">Google Compliant</div>
          </div>
        </div>

        <div className="footer-info">
          <p>This system helps customers easily leave Google reviews</p>
          <p className="note">All reviews are submitted manually by customers</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
