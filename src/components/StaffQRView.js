import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { feedbackMessages } from '../data/feedbackMessages';
import {
  subscribeToUsedFeedbacks,
  markFeedbackAsUsed,
  getStatistics
} from '../firebase/feedbackService';
import './StaffQRView.css';

const StaffQRView = () => {
  const [qrCodes, setQrCodes] = useState({});
  const [usedFeedbacks, setUsedFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [statistics, setStatistics] = useState(null);

  const BASE_URL = window.location.origin;

  // Subscribe to used feedbacks
  useEffect(() => {
    const unsubscribe = subscribeToUsedFeedbacks((feedbacks) => {
      setUsedFeedbacks(feedbacks.map(f => parseInt(f.id)));
    });

    loadStatistics();
    return () => unsubscribe();
  }, []);

  // Load statistics
  const loadStatistics = async () => {
    const stats = await getStatistics();
    setStatistics(stats);
  };

  // Generate QR codes for available feedbacks
  useEffect(() => {
    const generateQRCodes = async () => {
      const filtered = getFilteredFeedbacks();
      const newQrCodes = {};

      for (let i = 0; i < Math.min(filtered.length, 50); i++) {
        const { id } = filtered[i];
        const url = `${BASE_URL}/review?id=${id}`;

        try {
          const qrDataUrl = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 2,
            width: 300,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          newQrCodes[id] = qrDataUrl;
        } catch (error) {
          console.error(`Error generating QR code for ID ${id}:`, error);
        }
      }

      setQrCodes(newQrCodes);
    };

    generateQRCodes();
  }, [usedFeedbacks, searchTerm, selectedCategory, BASE_URL]);

  // Filter available feedbacks
  const getFilteredFeedbacks = () => {
    return feedbackMessages
      .map((feedback, index) => ({ feedback, id: index }))
      .filter(({ feedback, id }) => {
        const isNotUsed = !usedFeedbacks.includes(id);
        const matchesSearch = feedback.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' ||
          (selectedCategory === 'dental' && feedback.toLowerCase().includes('dental')) ||
          (selectedCategory === 'physio' && (feedback.toLowerCase().includes('physio') || feedback.toLowerCase().includes('therapy')));
        return isNotUsed && matchesSearch && matchesCategory;
      });
  };

  // Show confirmation dialog
  const handleMarkAsUsed = (feedback, id) => {
    setSelectedFeedback({ feedback, id });
    setShowConfirmDialog(true);
  };

  // Confirm mark as used
  const confirmMarkAsUsed = async () => {
    setLoading(true);
    setShowConfirmDialog(false);

    const result = await markFeedbackAsUsed(
      selectedFeedback.id,
      selectedFeedback.feedback
    );

    if (result.success) {
      showNotification('✅ Feedback marked as used!', 'success');
      await loadStatistics();
    } else {
      showNotification('❌ Error: ' + result.error, 'error');
    }

    setLoading(false);
    setSelectedFeedback(null);
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredFeedbacks = getFilteredFeedbacks();
  const availableCount = feedbackMessages.length - usedFeedbacks.length;

  return (
    <div className="staff-qr-view">
      {/* Header */}
      <div className="staff-qr-header">
        <div className="header-info">
          <h1>🔐 Staff QR Management</h1>
          <p>Show QR codes to customers and mark as used</p>
        </div>
        <div className="stats-quick">
          <div className="stat-item">
            <span className="stat-value">{availableCount}</span>
            <span className="stat-label">Available</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{usedFeedbacks.length}</span>
            <span className="stat-label">Used</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {statistics ? statistics.thisWeek : 0}
            </span>
            <span className="stat-label">This Week</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="staff-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Search feedbacks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="staff-search"
          />
        </div>
        <div className="filter-section">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All ({availableCount})
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'dental' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('dental')}
          >
            🦷 Dental
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'physio' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('physio')}
          >
            💪 Physio
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-banner">
        <p>Showing {filteredFeedbacks.length} available QR codes</p>
        <p className="instruction">👆 Show your device to customer → Customer scans → Click "Mark as Used"</p>
      </div>

      {/* QR Grid */}
      <div className="staff-qr-grid">
        {filteredFeedbacks.map(({ feedback, id }) => (
          <div key={id} className="staff-qr-card">
            {/* QR Code Section - Large for easy scanning */}
            <div className="qr-scan-area">
              <div className="qr-id-badge">#{id}</div>
              {qrCodes[id] ? (
                <img
                  src={qrCodes[id]}
                  alt={`QR Code ${id}`}
                  className="qr-code-large"
                />
              ) : (
                <div className="qr-loading">Generating...</div>
              )}
              <div className="scan-instruction">📱 Customer scans here</div>
            </div>

            {/* Feedback Text */}
            <div className="feedback-preview">
              <p className="feedback-text">"{feedback}"</p>
            </div>

            {/* Mark as Used Button - BIG and CLEAR */}
            <button
              onClick={() => handleMarkAsUsed(feedback, id)}
              className="mark-used-btn"
              disabled={loading}
            >
              ✓ Mark as Used
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFeedbacks.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎉</div>
          <h3>All feedbacks have been used!</h3>
          <p>Great job! Check the statistics or restore some feedbacks.</p>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirm-overlay" onClick={() => setShowConfirmDialog(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h2>Mark as Used?</h2>
            <div className="confirm-feedback-id">Feedback #{selectedFeedback?.id}</div>
            <div className="confirm-feedback-text">
              "{selectedFeedback?.feedback}"
            </div>
            <p className="confirm-warning">
              This QR code will be removed from the list immediately.
              Customer must have scanned it already!
            </p>
            <div className="confirm-actions">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="confirm-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={confirmMarkAsUsed}
                className="confirm-btn confirm"
              >
                ✓ Yes, Mark as Used
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">⏳</div>
          <p>Updating...</p>
        </div>
      )}
    </div>
  );
};

export default StaffQRView;
