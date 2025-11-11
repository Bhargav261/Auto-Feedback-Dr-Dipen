import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { getAllFeedbacks, getFeedbacksByCategory, getCategoryCount } from '../data/feedbackMessages';
import {
  subscribeToUsedFeedbacks,
  markFeedbackAsUsed,
  restoreFeedback,
  getStatistics
} from '../firebase/feedbackService';
import './FeedbackManagement.css';

const FeedbackManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available'); // 'available', 'used', 'statistics'
  const [usedFeedbacks, setUsedFeedbacks] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [qrCodes, setQrCodes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const BASE_URL = window.location.origin;

  // Subscribe to used feedbacks
  useEffect(() => {
    const unsubscribe = subscribeToUsedFeedbacks((feedbacks) => {
      setUsedFeedbacks(feedbacks);
    });

    loadStatistics();
    return () => unsubscribe();
  }, []);

  // Load statistics
  const loadStatistics = async () => {
    const stats = await getStatistics();
    setStatistics(stats);
  };

  // Generate QR codes
  useEffect(() => {
    const generateQRCodes = async () => {
      const filtered = getFilteredFeedbacks();
      const usedDetails = getUsedFeedbacksWithDetails();
      const allFeedbacks = [...filtered, ...usedDetails];
      const newQrCodes = {};

      for (let item of allFeedbacks) {
        const id = item.id;
        const url = `${BASE_URL}/review?id=${id}`;

        try {
          const qrDataUrl = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 2,
            width: 250,
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

  // Get available feedbacks
  const getFilteredFeedbacks = () => {
    const usedIds = usedFeedbacks.map(f => parseInt(f.id));
    const categoryFeedbacks = getFeedbacksByCategory(selectedCategory);

    return categoryFeedbacks
      .map((feedback, index) => {
        // Calculate correct ID based on category
        let actualId;
        if (selectedCategory === 'all') {
          actualId = index;
        } else if (selectedCategory === 'dental') {
          actualId = index; // Dental starts at 0
        } else if (selectedCategory === 'physio') {
          actualId = index + 100; // Physio starts at 100
        }
        return { feedback, id: actualId };
      })
      .filter(({ feedback, id }) => {
        const isNotUsed = !usedIds.includes(id);
        const matchesSearch = feedback.toLowerCase().includes(searchTerm.toLowerCase());
        return isNotUsed && matchesSearch;
      });
  };

  // Get used feedbacks with details
  const getUsedFeedbacksWithDetails = () => {
    const allFeedbacks = getAllFeedbacks();
    return usedFeedbacks
      .map(used => ({
        ...used,
        id: parseInt(used.id),
        feedback: allFeedbacks[parseInt(used.id)]
      }))
      .sort((a, b) => new Date(b.markedDate) - new Date(a.markedDate));
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/');
  };

  // Confirm action
  const confirmAction = (feedback, id, type) => {
    setSelectedFeedback({ feedback, id });
    setActionType(type);
    setShowConfirmDialog(true);
  };

  // Handle mark as used
  const handleMarkAsUsed = async () => {
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

  // Handle restore
  const handleRestore = async () => {
    setLoading(true);
    setShowConfirmDialog(false);

    const result = await restoreFeedback(selectedFeedback.id);

    if (result.success) {
      showNotification('✅ Feedback restored!', 'success');
      await loadStatistics();
    } else {
      showNotification('❌ Error: ' + result.error, 'error');
    }

    setLoading(false);
    setSelectedFeedback(null);
  };

  // Download QR
  const handleDownloadQR = (id) => {
    const qrDataUrl = qrCodes[id];
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `feedback-qr-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('📥 QR Code downloaded!', 'success');
  };

  // Print QR
  const handlePrintQR = (id, feedback) => {
    const qrDataUrl = qrCodes[id];
    if (!qrDataUrl) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code #${id}</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 40px; }
            h1 { color: #333; }
            img { max-width: 400px; border: 3px solid #333; padding: 15px; border-radius: 15px; }
            .qr-url { margin-top: 15px; font-family: monospace; background: #f8f9fa; padding: 10px; border-radius: 8px; }
            .feedback-text { margin-top: 20px; font-style: italic; color: #666; }
          </style>
        </head>
        <body>
          <h1>Ansh Dental And Physio Care</h1>
          <div>Feedback #${id}</div>
          <img src="${qrDataUrl}" alt="QR Code ${id}" />
          <div class="qr-url">${BASE_URL}/review?id=${id}</div>
          <div class="feedback-text">"${feedback}"</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredFeedbacks = getFilteredFeedbacks();
  const usedFeedbacksDetails = getUsedFeedbacksWithDetails();
  const totalCount = getAllFeedbacks().length;
  const availableCount = totalCount - usedFeedbacks.length;

  return (
    <div className="feedback-management-container">
      {/* Header */}
      <div className="feedback-header">
        <div className="header-left">
          <h1>🔐 Feedback Management</h1>
          <p>Manage QR codes and reviews</p>
        </div>
        <button onClick={handleLogout} className="logout-btn-small">
          🚪 Logout
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          📋 Available ({availableCount})
        </button>
        <button
          className={`tab-btn ${activeTab === 'used' ? 'active' : ''}`}
          onClick={() => setActiveTab('used')}
        >
          ✓ Used ({usedFeedbacks.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'statistics' ? 'active' : ''}`}
          onClick={() => setActiveTab('statistics')}
        >
          📊 Statistics
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Available Tab */}
        {activeTab === 'available' && (
          <>
            {/* Search and Filters */}
            <div className="controls-section">
              <input
                type="text"
                placeholder="🔍 Search feedbacks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="filter-buttons">
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

            {/* Feedbacks Grid */}
            <div className="feedbacks-grid">
              {filteredFeedbacks.map(({ feedback, id }) => (
                <div key={id} className="feedback-card">
                  <div className="card-header">
                    <span className="feedback-id">#{id}</span>
                    <span className="status-badge available">Available</span>
                  </div>
                  {qrCodes[id] ? (
                    <div className="qr-section">
                      <img src={qrCodes[id]} alt={`QR ${id}`} className="qr-image" />
                      <div className="qr-url">{BASE_URL}/review?id={id}</div>
                    </div>
                  ) : (
                    <div className="qr-loading">Generating...</div>
                  )}
                  <div className="feedback-text">"{feedback}"</div>
                  <button
                    onClick={() => confirmAction(feedback, id, 'markUsed')}
                    className="action-btn primary"
                    disabled={loading}
                  >
                    ✓ Mark as Used
                  </button>
                  <div className="qr-actions">
                    <button onClick={() => handleDownloadQR(id)} className="qr-btn download">
                      📥 Download
                    </button>
                    <button onClick={() => handlePrintQR(id, feedback)} className="qr-btn print">
                      🖨️ Print
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Used Tab */}
        {activeTab === 'used' && (
          <div className="feedbacks-grid">
            {usedFeedbacksDetails.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎉</div>
                <h3>No feedbacks used yet</h3>
                <p>Used feedbacks will appear here</p>
              </div>
            ) : (
              usedFeedbacksDetails.map((item) => (
                <div key={item.id} className="feedback-card used">
                  <div className="card-header">
                    <span className="feedback-id">#{item.id}</span>
                    <span className="status-badge used">Used</span>
                  </div>
                  {qrCodes[item.id] ? (
                    <div className="qr-section">
                      <img src={qrCodes[item.id]} alt={`QR ${item.id}`} className="qr-image" />
                      <div className="qr-url">{BASE_URL}/review?id={item.id}</div>
                    </div>
                  ) : (
                    <div className="qr-loading">Generating...</div>
                  )}
                  <div className="feedback-text">"{item.feedback}"</div>
                  <div className="used-date">📅 {new Date(item.markedDate).toLocaleString()}</div>
                  <button
                    onClick={() => confirmAction(item.feedback, item.id, 'restore')}
                    className="action-btn secondary"
                    disabled={loading}
                  >
                    ↩️ Restore
                  </button>
                  <div className="qr-actions">
                    <button onClick={() => handleDownloadQR(item.id)} className="qr-btn download">
                      📥 Download
                    </button>
                    <button onClick={() => handlePrintQR(item.id, item.feedback)} className="qr-btn print">
                      🖨️ Print
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && statistics && (
          <div className="statistics-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-value">{totalCount}</div>
                <div className="stat-label">Total Feedbacks</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✓</div>
                <div className="stat-value">{statistics.total}</div>
                <div className="stat-label">Used</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-value">{availableCount}</div>
                <div className="stat-label">Available</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-value">
                  {((statistics.total / totalCount) * 100).toFixed(1)}%
                </div>
                <div className="stat-label">Usage Rate</div>
              </div>
            </div>

            <div className="stats-section">
              <h3>📊 Category Breakdown</h3>
              <div className="category-list">
                <div className="category-item">
                  <span>🦷 Dental Feedbacks Used</span>
                  <span className="category-value">{statistics.dental}</span>
                </div>
                <div className="category-item">
                  <span>💪 Physio Feedbacks Used</span>
                  <span className="category-value">{statistics.physio}</span>
                </div>
              </div>
            </div>

            <div className="stats-section">
              <h3>📅 Usage Timeline</h3>
              <div className="timeline-list">
                <div className="timeline-item">
                  <span>This Week</span>
                  <span className="timeline-value">{statistics.thisWeek} reviews</span>
                </div>
                <div className="timeline-item">
                  <span>This Month</span>
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
                      <span className="recent-text">{item.feedbackText?.substring(0, 50)}...</span>
                      <span className="recent-date">{new Date(item.markedDate).toLocaleDateString()}</span>
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
            <div className="dialog-icon">{actionType === 'markUsed' ? '⚠️' : '↩️'}</div>
            <h3>{actionType === 'markUsed' ? 'Mark as Used?' : 'Restore Feedback?'}</h3>
            <div className="dialog-id">Feedback #{selectedFeedback?.id}</div>
            <div className="dialog-text">"{selectedFeedback?.feedback}"</div>
            <p className="dialog-warning">
              {actionType === 'markUsed'
                ? 'This will remove the feedback from the available list on ALL devices.'
                : 'This will make the feedback available again on ALL devices.'}
            </p>
            <div className="dialog-actions">
              <button onClick={() => setShowConfirmDialog(false)} className="dialog-btn cancel">
                Cancel
              </button>
              <button
                onClick={actionType === 'markUsed' ? handleMarkAsUsed : handleRestore}
                className="dialog-btn confirm"
              >
                {actionType === 'markUsed' ? '✓ Confirm' : '↩️ Restore'}
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
          <p>Processing...</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;
