import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import { getAllFeedbacks, getFeedbacksByCategory, getCategoryCount } from '../data/feedbackMessages';
import { subscribeToUsedFeedbacks } from '../firebase/feedbackService';
import './FeedbackList.css';

const FeedbackList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [qrCodes, setQrCodes] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [usedFeedbacks, setUsedFeedbacks] = useState([]);
  const qrCanvasRefs = useRef({});
  const navigate = useNavigate();

  // Your deployed domain - UPDATE THIS after deployment
  const BASE_URL = window.location.origin; // Uses current domain automatically

  // Subscribe to used feedbacks real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToUsedFeedbacks((feedbacks) => {
      setUsedFeedbacks(feedbacks.map(f => parseInt(f.id)));
    });

    return () => unsubscribe();
  }, []);

  // Generate QR codes for visible feedbacks
  useEffect(() => {
    const generateQRCodes = async () => {
      const filteredFeedbacks = getFilteredFeedbacks();
      const newQrCodes = {};

      for (let i = 0; i < filteredFeedbacks.length; i++) {
        const index = filteredFeedbacks[i].id;
        const url = `${BASE_URL}/review?id=${index}`;

        try {
          // Generate QR code as data URL
          const qrDataUrl = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 1,
            width: 200,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          newQrCodes[index] = qrDataUrl;
        } catch (error) {
          console.error(`Error generating QR code for ID ${index}:`, error);
        }
      }

      setQrCodes(newQrCodes);
    };

    generateQRCodes();
  }, [searchTerm, selectedCategory, usedFeedbacks, BASE_URL]);

  // Filter feedbacks by search term and category
  const getFilteredFeedbacks = () => {
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
        // Filter out used feedbacks
        const isNotUsed = !usedFeedbacks.includes(id);
        const matchesSearch = feedback.toLowerCase().includes(searchTerm.toLowerCase());
        return isNotUsed && matchesSearch;
      });
  };

  const filteredFeedbacks = getFilteredFeedbacks();
  const availableCount = getAllFeedbacks().length - usedFeedbacks.length;

  // Download QR code
  const downloadQR = (id) => {
    const qrDataUrl = qrCodes[id];
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `review-qr-${id}.png`;
    link.click();
  };

  // Copy feedback text to clipboard
  const copyFeedback = (feedback) => {
    navigator.clipboard.writeText(feedback)
      .then(() => {
        alert('Feedback copied to clipboard!');
      })
      .catch(() => {
        alert('Failed to copy. Please select and copy manually.');
      });
  };

  // Print specific QR code
  const printQR = (id) => {
    const qrDataUrl = qrCodes[id];
    if (!qrDataUrl) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code - Feedback #${id}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 40px;
              font-family: Arial, sans-serif;
            }
            h2 { margin-bottom: 20px; }
            img { width: 300px; height: 300px; }
            .feedback {
              max-width: 400px;
              text-align: center;
              margin-top: 20px;
              font-style: italic;
              color: #666;
            }
            .business {
              margin-top: 30px;
              font-weight: bold;
              color: #333;
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <h2>Scan to Review Us!</h2>
          <img src="${qrDataUrl}" alt="QR Code ${id}" />
          <div class="feedback">"${getAllFeedbacks()[id]}"</div>
          <div class="business">Ansh Dental And Physio Care</div>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">Feedback #${id}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="feedback-list-container">
      {/* Header */}
      <div className="feedback-list-header">
        <h1>📋 Review Feedback List</h1>
        <p className="subtitle">Ansh Dental And Physio Care</p>
        <p className="description">
          Choose a feedback message below. Each has a unique QR code that customers can scan
          to automatically copy the text and leave a Google review.
        </p>
        <button onClick={() => navigate('/admin')} className="admin-mode-btn">
          🔐 Admin Mode
        </button>
      </div>

      {/* Search and Filter */}
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search feedback messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All ({getAllFeedbacks().length})
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'dental' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('dental')}
          >
            🦷 Dental ({getCategoryCount('dental')})
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'physio' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('physio')}
          >
            💪 Physio ({getCategoryCount('physio')})
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        Showing {filteredFeedbacks.length} of {availableCount} available feedback messages
        {usedFeedbacks.length > 0 && (
          <span className="used-count"> ({usedFeedbacks.length} used)</span>
        )}
      </div>

      {/* Feedback List */}
      <div className="feedback-grid">
        {filteredFeedbacks.map(({ feedback, id }) => (
          <div key={id} className="feedback-card">
            <div className="feedback-header">
              <span className="feedback-id">#{id}</span>
              <div className="feedback-actions-top">
                <button
                  className="icon-btn"
                  onClick={() => copyFeedback(feedback)}
                  title="Copy feedback text"
                >
                  📋
                </button>
              </div>
            </div>

            <div className="feedback-content">
              <div className="qr-section">
                {qrCodes[id] ? (
                  <img
                    src={qrCodes[id]}
                    alt={`QR Code ${id}`}
                    className="qr-image"
                  />
                ) : (
                  <div className="qr-loading">Generating QR...</div>
                )}
                <div className="qr-url">
                  {BASE_URL}/review?id={id}
                </div>
              </div>

              <div className="feedback-text">
                "{feedback}"
              </div>
            </div>

            <div className="feedback-actions">
              <button
                className="action-btn download"
                onClick={() => downloadQR(id)}
                disabled={!qrCodes[id]}
              >
                💾 Download QR
              </button>
              <button
                className="action-btn print"
                onClick={() => printQR(id)}
                disabled={!qrCodes[id]}
              >
                🖨️ Print
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFeedbacks.length === 0 && (
        <div className="empty-state">
          <p>🔍 No feedback messages found matching "{searchTerm}"</p>
          <button onClick={() => setSearchTerm('')} className="reset-btn">
            Clear Search
          </button>
        </div>
      )}

      {/* Instructions Footer */}
      <div className="instructions-footer">
        <h3>📱 How to Use:</h3>
        <ol>
          <li><strong>Choose</strong> a feedback message from the list above</li>
          <li><strong>Download or Print</strong> the QR code</li>
          <li><strong>Display</strong> the QR code at your business location</li>
          <li><strong>Customers scan</strong> the QR code with their phone</li>
          <li><strong>Text auto-copies</strong> and they're redirected to Google Reviews</li>
          <li><strong>Customer pastes</strong> the feedback, rates, and submits! ⭐⭐⭐⭐⭐</li>
        </ol>
      </div>
    </div>
  );
};

export default FeedbackList;
