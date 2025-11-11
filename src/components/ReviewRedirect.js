import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFeedbackById, getRandomFeedback } from '../data/feedbackMessages';
import './ReviewRedirect.css';

// Your Google Review URL
const GOOGLE_REVIEW_URL = 'https://www.google.com/search?sca_esv=7c031b0b1e1c228d&rlz=1C1UEAD_enIN1021IN1021&sxsrf=AE3TifMUTlMvZ4RLNfC_3mspReZDG0tX1w:1762842570482&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E_aKsoSLlhCLevXBNC8DEj04k6MmlT6WagvmSmKcFbA-LV0qt59x_7UzNxViSOLJUQ8-6TZx_r6XQj4zC21lPsJ9FppAiABDSa7pEDYMYfP9SlHtXg%3D%3D&q=Ansh+Dental+And+Physio+Care+Reviews&sa=X&ved=2ahUKEwjdntWpvOmQAxXBcGwGHfxyOs4Q0bkNegQIKxAD&biw=1536&bih=695&dpr=1.25#lrd=0x3be051dee68be17d:0x617a872210ad873a,3,,,,';

// Redirect delay in milliseconds
const REDIRECT_DELAY = 1500;

const ReviewRedirect = () => {
  const [searchParams] = useSearchParams();
  const [copyStatus, setCopyStatus] = useState('copying'); // copying, success, failed
  const [feedbackText, setFeedbackText] = useState('');
  const [countdown, setCountdown] = useState(Math.ceil(REDIRECT_DELAY / 1000));

  useEffect(() => {
    // Get feedback message based on ID or random
    const id = searchParams.get('id');
    let feedback;

    if (id) {
      feedback = getFeedbackById(id);
      // Track which ID was used (for analytics)
      trackReviewAccess(id);
    }

    // If no ID or invalid ID, get random feedback
    if (!feedback) {
      feedback = getRandomFeedback();
      trackReviewAccess('random');
    }

    setFeedbackText(feedback);

    // Attempt to copy to clipboard automatically
    copyToClipboard(feedback);
  }, [searchParams]);

  // Countdown timer for redirect
  useEffect(() => {
    if (copyStatus === 'success') {
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            redirectToGoogle();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [copyStatus]);

  const copyToClipboard = async (text) => {
    try {
      // Check if clipboard API is available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopyStatus('success');
      } else {
        // Fallback for older browsers or iOS Safari
        fallbackCopy(text);
      }
    } catch (error) {
      console.error('Copy failed:', error);
      setCopyStatus('failed');
    }
  };

  const fallbackCopy = (text) => {
    try {
      // Create temporary textarea
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (successful) {
        setCopyStatus('success');
      } else {
        setCopyStatus('failed');
      }
    } catch (error) {
      console.error('Fallback copy failed:', error);
      setCopyStatus('failed');
    }
  };

  const redirectToGoogle = () => {
    window.location.href = GOOGLE_REVIEW_URL;
  };

  const handleManualCopy = () => {
    copyToClipboard(feedbackText);
  };

  const handleCopyAndRedirect = () => {
    if (copyStatus !== 'success') {
      copyToClipboard(feedbackText);
      // Wait a bit to ensure copy completes before redirect
      setTimeout(() => {
        redirectToGoogle();
      }, 500);
    } else {
      redirectToGoogle();
    }
  };

  // Optional: Track analytics
  const trackReviewAccess = (id) => {
    // Google Analytics event tracking (if GA is set up)
    if (window.gtag) {
      window.gtag('event', 'review_access', {
        event_category: 'Review Flow',
        event_label: `Feedback ID: ${id}`,
        value: id
      });
    }

    // You can also log to console for debugging
    console.log(`Review accessed with ID: ${id}`);
  };

  return (
    <div className="review-redirect-container">
      <div className="review-redirect-content">
        {copyStatus === 'copying' && (
          <>
            <div className="spinner"></div>
            <h2>Preparing your feedback...</h2>
          </>
        )}

        {copyStatus === 'success' && (
          <>
            <div className="success-icon">✅</div>
            <h2>Feedback Copied!</h2>
            <p className="redirect-message">
              Redirecting to Google Reviews in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
            <div className="feedback-preview">
              <p><strong>Your feedback:</strong></p>
              <p className="feedback-text">{feedbackText}</p>
            </div>
            <button
              className="redirect-button"
              onClick={redirectToGoogle}
            >
              Go to Google Reviews Now
            </button>
          </>
        )}

        {copyStatus === 'failed' && (
          <>
            <div className="warning-icon">⚠️</div>
            <h2>Tap to Copy Your Feedback</h2>
            <div className="feedback-preview">
              <p className="feedback-text">{feedbackText}</p>
            </div>
            <button
              className="copy-button"
              onClick={handleManualCopy}
            >
              Copy Feedback
            </button>
            <button
              className="redirect-button"
              onClick={handleCopyAndRedirect}
            >
              Copy & Open Google Reviews
            </button>
            <p className="instruction-text">
              After copying, paste the text in Google Reviews, select your rating, and post!
            </p>
          </>
        )}
      </div>

      <div className="footer">
        <p>Ansh Dental And Physio Care</p>
        <p className="footer-note">Thank you for sharing your experience!</p>
      </div>
    </div>
  );
};

export default ReviewRedirect;
