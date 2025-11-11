import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLogin from '../components/AdminLogin';

/**
 * LoginPage Component
 * Standalone login page accessible via /login route
 */
const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (status) => {
    if (status) {
      // On successful login, redirect to feedback management
      navigate('/app/feedback', { replace: true });
    }
  };

  return <AdminLogin onLogin={handleLogin} />;
};

export default LoginPage;
