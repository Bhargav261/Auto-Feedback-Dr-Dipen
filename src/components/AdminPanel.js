import React, { useState, useEffect } from 'react';
import { feedbackMessages } from '../data/feedbackMessages';
import {
  subscribeToUsedFeedbacks,
  markFeedbackAsUsed,
  restoreFeedback,
  getStatistics
} from '../firebase/feedbackService';
import './AdminPanel.css';

const AdminPanel = () => {
  const [usedFeedbacks, setUsedFeedbacks] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [view, setView] = useState('available'); // 'available', 'used', 'statistics'
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [actionType, setActionType] = useState(null); // 'markUsed' or 'restore'
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToUsedFeedbacks((feedbacks) => {
      setUsedFeedbacks(feedbacks);
    });

    // Load statistics
    loadStatistics();

    return () => unsubscribe();
  }, []);

  const loadStatistics = async () => {
    const stats = await getStatistics();
    setStatistics(stats);
  };

  // Get available feedbacks (not used)
  const getAvailableFeedbacks = () => {
    const usedIds = usedFeedbacks.map(f => parseInt(f.id));
    return feedbackMessages
      .map((feedback, index) => ({ feedback, id: index }))
      .filter(({ id }) => !usedIds.includes(id));
  };

  // Get used feedbacks with details
  const getUsedFeedbacksWithDetails = () => {
    return usedFeedbacks
      .map(used => ({
        ...used,
        id: parseInt(used.id),
        feedback: feedbackMessages[parseInt(used.id)]
      }))
      .sort((a, b) => new Date(b.markedDate) - new Date(a.markedDate));
  };

  // Show confirmation dialog
  const confirmAction = (feedback, id, type) => {
    setActionFeedback({ feedback, id });
    setActionType(type);
    setShowConfirmDialog(true);
  };

  // Handle mark as used
  const handleMarkAsUsed = async () => {
    setLoading(true);
    setShowConfirmDialog(false);

    const result = await markFeedbackAsUsed(
      actionFeedback.id,
      actionFeedback.feedback
    );

    if (result.success) {
      showNotification('✅ Feedback marked as used!', 'success');
      await loadStatistics();
    } else {
      showNotification('❌ Error: ' + result.error, 'error');
    }

    setLoading(false);
    setActionFeedback(null);
  };

  // Handle restore
  const handleRestore = async () => {
    setLoading(true);
    setShowConfirmDialog(false);

    const result = await restoreFeedback(actionFeedback.id);

    if (result.success) {
      showNotification('✅ Feedback restored!', 'success');
      await loadStatistics();
    } else {
      showNotification('❌ Error: ' + result.error, 'error');
    }

    setLoading(false);
    setActionFeedback(null);
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    window.location.href = '/';
  };

  const availableFeedbacks = getAvailableFeedbacks();
  const usedFeedbacksDetails = getUsedFeedbacksWithDetails();

  return (
    <div className="admin-panel-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>🔐 Admin Panel</h1>
          <p>Manage Used Feedbacks</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>

      {/* Navigation */}
      <div className="admin-nav">
        <button
          className={`nav-btn ${view === 'available' ? 'active' : ''}`}
          onClick={() => setView('available')}
        >
          📋 Available ({availableFeedbacks.length})
        </button>
        <button
          className={`nav-btn ${view === 'used' ? 'active' : ''}`}
          onClick={() => setView('used')}
        >
          ✓ Used ({usedFeedbacks.length})
        </button>
        <button
          className={`nav-btn ${view === 'statistics' ? 'active' : ''}`}
          onClick={() => setView('statistics')}
        >
          📊 Statistics
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Content */}
      <div className="admin-content">
        {/* Available Feedbacks View */}
        {view === 'available' && (
          <div className="feedbacks-grid">
            {availableFeedbacks.map(({ feedback, id }) => (
              <div key={id} className="admin-feedback-card available">
                <div className="card-header">
                  <span className="feedback-id">#{id}</span>
                  <span className="status-badge available">Available</span>
                </div>
                <div className="feedback-text">"{feedback}"</div>
                <button
                  onClick={() => confirmAction(feedback, id, 'markUsed')}
                  className="action-btn mark-used"
                  disabled={loading}
                >
                  ✓ Mark as Used
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Used Feedbacks View */}
        {view === 'used' && (
          <div className="feedbacks-grid">
            {usedFeedbacksDetails.length === 0 ? (
              <div className="empty-state">
                <p>No feedbacks have been marked as used yet.</p>
              </div>
            ) : (
              usedFeedbacksDetails.map((item) => (
                <div key={item.id} className="admin-feedback-card used">
                  <div className="card-header">
                    <span className="feedback-id">#{item.id}</span>
                    <span className="status-badge used">Used</span>
                  </div>
                  <div className="feedback-text">"{item.feedback}"</div>
                  <div className="used-info">
                    📅 {new Date(item.markedDate).toLocaleString()}
                  </div>
                  <button
                    onClick={() => confirmAction(item.feedback, item.id, 'restore')}
                    className="action-btn restore"
                    disabled={loading}
                  >
                    ↩️ Restore
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Statistics View */}
        {view === 'statistics' && statistics && (
          <div className="statistics-view">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-value">{feedbackMessages.length}</div>
                <div className="stat-label">Total Feedbacks</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✓</div>
                <div className="stat-value">{statistics.total}</div>
                <div className="stat-label">Used</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-value">{availableFeedbacks.length}</div>
                <div className="stat-label">Available</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-value">
                  {((statistics.total / feedbackMessages.length) * 100).toFixed(1)}%
                </div>
                <div className="stat-label">Usage Rate</div>
              </div>
            </div>

            <div className="stats-section">
              <h3>📊 Category Breakdown</h3>
              <div className="category-stats">
                <div className="category-item">
                  <span className="category-label">🦷 Dental Feedbacks Used</span>
                  <span className="category-value">{statistics.dental}</span>
                </div>
                <div className="category-item">
                  <span className="category-label">💪 Physio Feedbacks Used</span>
                  <span className="category-value">{statistics.physio}</span>
                </div>
              </div>
            </div>

            <div className="stats-section">
              <h3>📅 Usage Timeline</h3>
              <div className="timeline-stats">
                <div className="timeline-item">
                  <span className="timeline-label">This Week</span>
                  <span className="timeline-value">{statistics.thisWeek} reviews</span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-label">This Month</span>
                  <span className="timeline-value">{statistics.thisMonth} reviews</span>
                </div>
              </div>
            </div>

            {statistics.recent.length > 0 && (
              <div className="stats-section">
                <h3>🕐 Recent Activity</h3>
                <div className="recent-list">
                  {statistics.recent.map((item) => (
                    <div key={item.id} className="recent-item">
                      <span className="recent-id">#{item.id}</span>
                      <span className="recent-text">
                        {item.feedbackText?.substring(0, 50)}...
                      </span>
                      <span className="recent-date">
                        {new Date(item.markedDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="dialog-overlay" onClick={() => setShowConfirmDialog(false)}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <span className="dialog-icon">
                {actionType === 'markUsed' ? '⚠️' : '↩️'}
              </span>
              <h3>
                {actionType === 'markUsed'
                  ? 'Mark Feedback as Used?'
                  : 'Restore Feedback?'}
              </h3>
            </div>

            <div className="dialog-content">
              <div className="dialog-feedback-id">
                Feedback #{actionFeedback?.id}
              </div>
              <div className="dialog-feedback-text">
                "{actionFeedback?.feedback}"
              </div>
              <p className="dialog-warning">
                {actionType === 'markUsed'
                  ? 'This will remove the feedback from the available list on ALL devices.'
                  : 'This will make the feedback available again on ALL devices.'}
              </p>
            </div>

            <div className="dialog-actions">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="dialog-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={actionType === 'markUsed' ? handleMarkAsUsed : handleRestore}
                className="dialog-btn confirm"
              >
                {actionType === 'markUsed' ? '✓ Mark as Used' : '↩️ Restore'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">⏳</div>
          <p>Processing...</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
