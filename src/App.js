import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReviewRedirect from './components/ReviewRedirect';
import FeedbackList from './components/FeedbackList';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is authenticated
    const authStatus = sessionStorage.getItem('adminAuth');
    setIsAdminAuthenticated(authStatus === 'true');
  }, []);

  const handleAdminLogin = (status) => {
    setIsAdminAuthenticated(status);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FeedbackList />} />
        <Route path="/review" element={<ReviewRedirect />} />
        <Route
          path="/admin"
          element={
            isAdminAuthenticated ? (
              <AdminPanel />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
