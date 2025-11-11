import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedbackList from './FeedbackList';
import AdminPanel from './AdminPanel';
import AdminLogin from './AdminLogin';
import StaffQRView from './StaffQRView';
import './Homepage.css';

const Homepage = () => {
  const [showStaffLogin, setShowStaffLogin] = useState(false);
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState('home'); // 'home', 'reviews', 'admin'
  const navigate = useNavigate();

  useEffect(() => {
    // Check if staff is already logged in
    const authStatus = sessionStorage.getItem('adminAuth');
    setIsStaffLoggedIn(authStatus === 'true');
  }, []);

  const handleStaffLogin = (status) => {
    setIsStaffLoggedIn(status);
    setShowStaffLogin(false);
    setActiveView('admin');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsStaffLoggedIn(false);
    setActiveView('home');
  };

  // If staff login modal is open
  if (showStaffLogin && !isStaffLoggedIn) {
    return <AdminLogin onLogin={handleStaffLogin} />;
  }

  // If staff is logged in and in admin view
  if (isStaffLoggedIn && activeView === 'admin') {
    return <AdminPanel onLogout={handleLogout} onBackToHome={() => setActiveView('home')} />;
  }

  // Main Homepage
  return (
    <div className="homepage-container">
      {/* Header Navigation */}
      <header className="homepage-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">Ansh Dental And Physio Care</h1>
            <p className="tagline">Your Complete Healthcare Solution</p>
          </div>

          <nav className="main-nav">
            <button
              className={`nav-link ${activeView === 'home' ? 'active' : ''}`}
              onClick={() => setActiveView('home')}
            >
              🏠 Home
            </button>
            <button
              className={`nav-link ${activeView === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveView('reviews')}
            >
              📝 Reviews
            </button>
            {isStaffLoggedIn && (
              <button
                className={`nav-link ${activeView === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveView('admin')}
              >
                🔐 Admin
              </button>
            )}
          </nav>

          {isStaffLoggedIn && (
            <button onClick={handleLogout} className="logout-btn-header">
              🚪 Logout
            </button>
          )}
        </div>
      </header>

      {/* Content Area */}
      <main className="homepage-content">
        {activeView === 'home' && (
          <>
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-content">
                <h2 className="hero-title">Welcome to Excellence in Healthcare</h2>
                <p className="hero-description">
                  Providing comprehensive dental and physiotherapy services with care and compassion
                </p>
                <div className="hero-buttons">
                  <button
                    className="hero-btn primary"
                    onClick={() => setActiveView('reviews')}
                  >
                    📝 Leave a Review
                  </button>
                  <button className="hero-btn secondary">
                    📞 Book Appointment
                  </button>
                </div>
              </div>
            </section>

            {/* Services Section */}
            <section className="services-section">
              <h2 className="section-title">Our Services</h2>
              <div className="services-grid">
                <div className="service-card dental">
                  <div className="service-icon">🦷</div>
                  <h3>Dental Care</h3>
                  <ul className="service-list">
                    <li>Root Canal Treatment</li>
                    <li>Teeth Whitening</li>
                    <li>Dental Implants</li>
                    <li>Orthodontics</li>
                    <li>Cosmetic Dentistry</li>
                  </ul>
                </div>

                <div className="service-card physio">
                  <div className="service-icon">💪</div>
                  <h3>Physiotherapy</h3>
                  <ul className="service-list">
                    <li>Sports Injury Treatment</li>
                    <li>Back Pain Relief</li>
                    <li>Rehabilitation</li>
                    <li>Manual Therapy</li>
                    <li>Post-Surgery Care</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Why Choose Us */}
            <section className="features-section">
              <h2 className="section-title">Why Choose Us?</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">👨‍⚕️</div>
                  <h4>Expert Professionals</h4>
                  <p>Highly qualified and experienced doctors</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🏥</div>
                  <h4>Modern Facilities</h4>
                  <p>State-of-the-art equipment and technology</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">⭐</div>
                  <h4>5-Star Service</h4>
                  <p>Exceptional patient care and satisfaction</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">💰</div>
                  <h4>Affordable Pricing</h4>
                  <p>Quality healthcare at reasonable costs</p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
              <h2 className="section-title">Visit Us</h2>
              <div className="contact-grid">
                <div className="contact-card">
                  <div className="contact-icon">📍</div>
                  <h4>Location</h4>
                  <p>123 Healthcare Avenue<br/>Your City, State 12345</p>
                </div>
                <div className="contact-card">
                  <div className="contact-icon">📞</div>
                  <h4>Phone</h4>
                  <p>+1 (555) 123-4567<br/>+1 (555) 765-4321</p>
                </div>
                <div className="contact-card">
                  <div className="contact-icon">⏰</div>
                  <h4>Hours</h4>
                  <p>Mon-Fri: 9:00 AM - 7:00 PM<br/>Sat: 9:00 AM - 5:00 PM</p>
                </div>
                <div className="contact-card">
                  <div className="contact-icon">✉️</div>
                  <h4>Email</h4>
                  <p>info@anshcare.com<br/>appointments@anshcare.com</p>
                </div>
              </div>
            </section>
          </>
        )}

        {activeView === 'reviews' && (
          <div className="reviews-view">
            {isStaffLoggedIn ? (
              <StaffQRView />
            ) : (
              <FeedbackList isStaffView={false} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Ansh Dental And Physio Care</h4>
            <p>Your trusted partner in health and wellness</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <button onClick={() => setActiveView('home')} className="footer-link">Home</button>
            <button onClick={() => setActiveView('reviews')} className="footer-link">Leave Review</button>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>📞 +1 (555) 123-4567</p>
            <p>✉️ info@anshcare.com</p>
          </div>
          {!isStaffLoggedIn && (
            <div className="footer-section">
              <button
                onClick={() => setShowStaffLogin(true)}
                className="staff-login-footer"
              >
                🔐 Staff Login
              </button>
            </div>
          )}
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Ansh Dental And Physio Care. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
