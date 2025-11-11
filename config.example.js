// Configuration Example File
// Copy this file and customize as needed

// Your Google Review URL
// This is the URL customers will be redirected to after copying the feedback
export const GOOGLE_REVIEW_URL = 'https://www.google.com/search?sca_esv=7c031b0b1e1c228d&rlz=1C1UEAD_enIN1021IN1021&sxsrf=AE3TifMUTlMvZ4RLNfC_3mspReZDG0tX1w:1762842570482&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E_aKsoSLlhCLevXBNC8DEj04k6MmlT6WagvmSmKcFbA-LV0qt59x_7UzNxViSOLJUQ8-6TZx_r6XQj4zC21lPsJ9FppAiABDSa7pEDYMYfP9SlHtXg%3D%3D&q=Ansh+Dental+And+Physio+Care+Reviews&sa=X&ved=2ahUKEwjdntWpvOmQAxXBcGwGHfxyOs4Q0bkNegQIKxAD&biw=1536&bih=695&dpr=1.25#lrd=0x3be051dee68be17d:0x617a872210ad873a,3,,,,';

// Redirect delay in milliseconds (time before redirecting to Google)
// Default: 1500ms (1.5 seconds)
export const REDIRECT_DELAY = 1500;

// Business Information
export const BUSINESS_INFO = {
  name: 'Ansh Dental And Physio Care',
  tagline: 'Thank you for sharing your experience!',
  // You can add more business info here if needed
};

// QR Code Generation Configuration
export const QR_CONFIG = {
  // Your deployed website domain (update this after deployment)
  baseURL: 'https://yourdomain.com/review',

  // Total number of QR codes to generate (should match feedback messages count)
  totalQRCodes: 200,

  // QR Code image settings
  imageSize: 500, // pixels
  errorCorrection: 'H', // High error correction
  margin: 1, // White border around QR code

  // Output directory
  outputDir: './qr-codes',
};

// Google Analytics Configuration (optional)
export const ANALYTICS_CONFIG = {
  enabled: false, // Set to true to enable analytics
  measurementId: 'GA_MEASUREMENT_ID', // Replace with your GA ID
};

// UI Customization
export const UI_CONFIG = {
  // Primary gradient colors
  primaryGradient: {
    start: '#667eea',
    end: '#764ba2',
  },

  // Success color
  successColor: '#48bb78',

  // Text colors
  textPrimary: '#333',
  textSecondary: '#666',
  textLight: '#888',
};

// Feature Flags
export const FEATURES = {
  showCountdown: true, // Show countdown timer before redirect
  showFeedbackPreview: true, // Show the feedback text on screen
  enableManualCopyButton: true, // Show manual copy button when auto-copy fails
  trackAnalytics: false, // Enable/disable analytics tracking
};

// Messages
export const MESSAGES = {
  copying: 'Preparing your feedback...',
  success: 'Feedback Copied!',
  failed: 'Tap to Copy Your Feedback',
  redirecting: 'Redirecting to Google Reviews in',
  instruction: 'After copying, paste the text in Google Reviews, select your rating, and post!',
};
