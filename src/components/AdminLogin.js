import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Default admin password - Change this to your own password
  const ADMIN_PASSWORD = 'admin2024';

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setError('');
      // Store auth in sessionStorage (cleared when browser closes)
      sessionStorage.setItem('adminAuth', 'true');
      onLogin(true);
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <div className="lock-icon">🔐</div>
          <h2>Admin Access</h2>
          <p className="subtitle">Enter password to manage feedbacks</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="password-input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="password-input"
              autoFocus
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="login-button">
            🔓 Login
          </button>
        </form>

        <div className="admin-help">
          <p className="help-text">
            <strong>Default password:</strong> admin2024
          </p>
          <p className="help-note">
            💡 Change this in <code>AdminLogin.js</code> line 10
          </p>
        </div>
      </div>

      <div className="back-to-list">
        <button onClick={() => window.location.href = '/'} className="back-btn">
          ← Back to Feedback List
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
