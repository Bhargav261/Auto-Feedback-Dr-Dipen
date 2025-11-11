import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();

  const handleStaffLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="homepage-container">
      {/* Header Navigation */}
      <header className="homepage-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">🏥</div>
            <div className="logo-text">
              <h1 className="logo">Ansh Dental And Physio Care</h1>
              <p className="tagline">Excellence in Healthcare Since 2020</p>
            </div>
          </div>
          <button onClick={handleStaffLoginClick} className="staff-login-btn">
            🔐 Staff Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">⭐ Award-Winning Healthcare</div>
          <h1 className="hero-title">Your Health, Our Priority</h1>
          <p className="hero-subtitle">
            Experience world-class dental and physiotherapy care in a comfortable,
            modern environment with state-of-the-art technology
          </p>
          <div className="hero-buttons">
            <a href="tel:+1234567890" className="hero-btn primary">
              📞 Book Appointment
            </a>
            <a href="#about" className="hero-btn secondary">
              Learn More
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">5000+</div>
              <div className="stat-label">Happy Patients</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="about-content">
            <div className="about-text">
              <div className="section-badge">About Us</div>
              <h2 className="section-title">Committed to Your Well-being</h2>
              <p className="about-description">
                At Ansh Dental And Physio Care, we believe in providing comprehensive healthcare
                solutions under one roof. Our team of highly qualified professionals combines years
                of experience with cutting-edge technology to deliver exceptional care.
              </p>
              <p className="about-description">
                Whether you need dental treatment or physiotherapy services, we're dedicated to
                helping you achieve optimal health and wellness. Our patient-first approach ensures
                personalized care tailored to your unique needs.
              </p>
              <div className="about-highlights">
                <div className="highlight-item">
                  <span className="highlight-icon">✓</span>
                  <span>Expert Medical Professionals</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-icon">✓</span>
                  <span>Advanced Medical Equipment</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-icon">✓</span>
                  <span>Personalized Treatment Plans</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-icon">✓</span>
                  <span>Comfortable & Hygienic Environment</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <div className="placeholder-icon">🏥</div>
                <p>Modern Medical Facility</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="section-container">
          <div className="section-badge">Our Services</div>
          <h2 className="section-title">Comprehensive Care Solutions</h2>
          <p className="section-subtitle">
            From routine check-ups to specialized treatments, we offer a full range of dental and physiotherapy services
          </p>

          <div className="services-grid">
            {/* Dental Services */}
            <div className="service-card dental">
              <div className="service-header">
                <div className="service-icon">🦷</div>
                <h3>Dental Care</h3>
              </div>
              <p className="service-description">
                Complete dental solutions for a healthy, beautiful smile
              </p>
              <ul className="service-list">
                <li>
                  <span className="list-icon">✓</span>
                  Root Canal Treatment
                </li>
                <li>
                  <span className="list-icon">✓</span>
                  Teeth Whitening & Cleaning
                </li>
                <li>
                  <span className="list-icon">✓</span>
                  Dental Implants
                </li>
                <li>
                  <span className="list-icon">✓</span>
                  Orthodontics & Braces
                </li>
                <li>
                  <span className="list-icon">✓</span>
                  Cosmetic Dentistry
                </li>
                <li>
                  <span className="list-icon">✓</span>
                  Pediatric Dental Care
                </li>
              </ul>
              <button className="service-btn">Learn More</button>
            </div>

            {/* Physio Services */}
            <div className="service-card physio">
              <div className="service-header">
                <div className="service-icon">💪</div>
                <h3>Physiotherapy</h3>
              </div>
              <p className="service-description">
                Expert rehabilitation and pain management therapies
              </p>
              <ul className="service-list">
                <li>
                  <span className="list-icon">✓</span>
                  Sports Injury Treatment
                </li>
                <li>
                  <span className="list-icon">✓</span>
                  Back & Neck Pain Relief
                </li>
                <li>
                  <span className="list-icon">✓</span>
                  Post-Surgery Rehabilitation
                </li>
                <li>
                  <span className="list-icon">✓</span>
                  Manual Therapy
                </li>
                <li>
                  <span className="list-icon">✓</span>
                  Therapeutic Exercises
                </li>
                <li>
                  <span className="list-icon">✓</span>
                  Electrotherapy & TENS
                </li>
              </ul>
              <button className="service-btn">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="team-section">
        <div className="section-container">
          <div className="section-badge">Our Experts</div>
          <h2 className="section-title">Meet Our Professional Team</h2>
          <p className="section-subtitle">
            Experienced healthcare professionals dedicated to providing you with the best care
          </p>

          <div className="team-grid">
            {/* Doctor 1 */}
            <div className="team-card">
              <div className="doctor-image-placeholder">
                <div className="placeholder-icon">👨‍⚕️</div>
                <span className="image-note">Add doctor photo</span>
              </div>
              <div className="doctor-info">
                <h3>Dr. [Your Name]</h3>
                <p className="designation">Chief Dentist</p>
                <p className="qualification">BDS, MDS</p>
                <p className="experience">15+ Years Experience</p>
                <p className="specialization">Specialist in Root Canal & Cosmetic Dentistry</p>
              </div>
            </div>

            {/* Doctor 2 */}
            <div className="team-card">
              <div className="doctor-image-placeholder">
                <div className="placeholder-icon">👨‍⚕️</div>
                <span className="image-note">Add doctor photo</span>
              </div>
              <div className="doctor-info">
                <h3>Dr. [Your Name]</h3>
                <p className="designation">Senior Physiotherapist</p>
                <p className="qualification">BPT, MPT</p>
                <p className="experience">12+ Years Experience</p>
                <p className="specialization">Specialist in Sports Injury & Rehabilitation</p>
              </div>
            </div>

            {/* Doctor 3 */}
            <div className="team-card">
              <div className="doctor-image-placeholder">
                <div className="placeholder-icon">👨‍⚕️</div>
                <span className="image-note">Add doctor photo</span>
              </div>
              <div className="doctor-info">
                <h3>Dr. [Your Name]</h3>
                <p className="designation">Dental Surgeon</p>
                <p className="qualification">BDS</p>
                <p className="experience">10+ Years Experience</p>
                <p className="specialization">Specialist in Oral Surgery & Implants</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-badge">Why Choose Us</div>
          <h2 className="section-title">What Makes Us Different</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👨‍⚕️</div>
              <h4>Expert Doctors</h4>
              <p>Highly qualified and experienced medical professionals dedicated to your care</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <h4>Modern Facilities</h4>
              <p>State-of-the-art equipment and technology for accurate diagnosis and treatment</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h4>5-Star Service</h4>
              <p>Exceptional patient care with personalized attention and comfort</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h4>Affordable Care</h4>
              <p>Quality healthcare at reasonable prices with flexible payment options</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🕐</div>
              <h4>Flexible Hours</h4>
              <p>Extended working hours and weekend availability for your convenience</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h4>Safe & Hygienic</h4>
              <p>Strict sterilization protocols and hygiene standards for your safety</p>
            </div>
          </div>
        </div>
      </section>

      {/* Clinic Gallery */}
      <section className="gallery-section">
        <div className="section-container">
          <div className="section-badge">Our Facility</div>
          <h2 className="section-title">Take A Virtual Tour</h2>
          <p className="section-subtitle">
            Experience our modern, state-of-the-art clinic designed for your comfort and care
          </p>

          <div className="gallery-grid">
            {/* Gallery Item 1 */}
            <div className="gallery-item">
              <div className="gallery-image-placeholder">
                <div className="placeholder-icon">🏥</div>
                <span className="image-note">Reception Area</span>
              </div>
              <p className="gallery-caption">Modern Reception Area</p>
            </div>

            {/* Gallery Item 2 */}
            <div className="gallery-item">
              <div className="gallery-image-placeholder">
                <div className="placeholder-icon">🦷</div>
                <span className="image-note">Dental Room</span>
              </div>
              <p className="gallery-caption">Advanced Dental Care Room</p>
            </div>

            {/* Gallery Item 3 */}
            <div className="gallery-item">
              <div className="gallery-image-placeholder">
                <div className="placeholder-icon">💪</div>
                <span className="image-note">Physio Room</span>
              </div>
              <p className="gallery-caption">Physiotherapy Treatment Room</p>
            </div>

            {/* Gallery Item 4 */}
            <div className="gallery-item">
              <div className="gallery-image-placeholder">
                <div className="placeholder-icon">🪑</div>
                <span className="image-note">Waiting Area</span>
              </div>
              <p className="gallery-caption">Comfortable Waiting Area</p>
            </div>

            {/* Gallery Item 5 */}
            <div className="gallery-item">
              <div className="gallery-image-placeholder">
                <div className="placeholder-icon">🔬</div>
                <span className="image-note">Equipment</span>
              </div>
              <p className="gallery-caption">Modern Medical Equipment</p>
            </div>

            {/* Gallery Item 6 */}
            <div className="gallery-item">
              <div className="gallery-image-placeholder">
                <div className="placeholder-icon">🏢</div>
                <span className="image-note">Exterior</span>
              </div>
              <p className="gallery-caption">Clinic Exterior View</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Hours Section */}
      <section className="contact-section">
        <div className="section-container">
          <div className="section-badge">Get In Touch</div>
          <h2 className="section-title">Visit Us Today</h2>

          <div className="contact-grid">
            {/* Clinic Hours */}
            <div className="contact-card hours-card">
              <div className="contact-icon">⏰</div>
              <h3>Clinic Hours</h3>
              <div className="hours-list">
                <div className="hours-item">
                  <span className="day">Monday - Friday</span>
                  <span className="time">9:00 AM - 8:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="day">Saturday</span>
                  <span className="time">9:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="day">Sunday</span>
                  <span className="time">10:00 AM - 4:00 PM</span>
                </div>
              </div>
              {/* <div className="emergency-note">
                🚨 Emergency services available 24/7
              </div> */}
            </div>

            {/* Contact Info */}
            <div className="contact-card info-card">
              <div className="contact-icon">📞</div>
              <h3>Contact Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-icon">📱</span>
                  <div className="info-details">
                    <div className="info-label">Primary</div>
                    <a href="tel:+1234567890" className="info-value">+1 (234) 567-890</a>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">☎️</span>
                  <div className="info-details">
                    <div className="info-label">Secondary</div>
                    <a href="tel:+1234567891" className="info-value">+1 (234) 567-891</a>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">✉️</span>
                  <div className="info-details">
                    <div className="info-label">Email</div>
                    <a href="mailto:info@anshcare.com" className="info-value">info@anshcare.com</a>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">📧</span>
                  <div className="info-details">
                    <div className="info-label">Appointments</div>
                    <a href="mailto:appointments@anshcare.com" className="info-value">appointments@anshcare.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="contact-card location-card">
              <div className="contact-icon">📍</div>
              <h3>Our Location</h3>
              <div className="location-details">
                <p className="address">
                  <strong>Ansh Dental And Physio Care</strong><br/>
                  123 Healthcare Avenue<br/>
                  Medical District<br/>
                  Your City, State 12345<br/>
                  India
                </p>
                <button className="direction-btn">
                  🗺️ Get Directions
                </button>
                {/* <div className="location-features">
                  <span className="location-feature">🅿️ Free Parking</span>
                  <span className="location-feature">♿ Wheelchair Access</span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Experience Better Healthcare?</h2>
          <p className="cta-subtitle">Book your appointment today and take the first step towards a healthier you</p>
          <div className="cta-buttons">
            <a href="tel:+1234567890" className="cta-btn primary">
              📞 Call Now
            </a>
            <button className="cta-btn secondary">
              📅 Schedule Online
            </button>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="footer-logo-icon">🏥</div>
              <div>
                <h3>Ansh Dental And Physio Care</h3>
                <p>Excellence in Healthcare</p>
              </div>
            </div>
            <p className="footer-description">
              Your trusted partner in comprehensive dental and physiotherapy care.
              We're committed to providing exceptional healthcare services with compassion and expertise.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><button onClick={handleStaffLoginClick} className="footer-link-btn">Staff Portal</button></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              <li>Dental Care</li>
              <li>Physiotherapy</li>
              <li>Emergency Care</li>
              <li>Consultations</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <div className="footer-contact">
              <p>📞 +1 (234) 567-890</p>
              <p>✉️ info@anshcare.com</p>
              <p>📍 123 Healthcare Avenue</p>
              <p>Your City, State 12345</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Ansh Dental And Physio Care. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <span>|</span>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
