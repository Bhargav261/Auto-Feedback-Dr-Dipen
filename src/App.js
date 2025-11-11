import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './components/Homepage';
import ReviewRedirect from './components/ReviewRedirect';
import LoginPage from './pages/LoginPage';
import FeedbackManagement from './pages/FeedbackManagement';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/review" element={<ReviewRedirect />} />

        {/* Login Route - Redirects to /app/feedback if already authenticated */}
        <Route
          path="/login"
          element={
            <PublicRoute restricted={true}>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Private Routes - Require Authentication */}
        <Route
          path="/app/feedback"
          element={
            <PrivateRoute>
              <FeedbackManagement />
            </PrivateRoute>
          }
        />

        {/* 404 - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
