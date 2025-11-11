import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * PublicRoute Component
 * Routes that are accessible only when NOT authenticated
 * For example: Login page should redirect to feedback management if already logged in
 */
const PublicRoute = ({ children, restricted = false }) => {
  const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';

  // If route is restricted and user is authenticated, redirect to feedback management
  if (restricted && isAuthenticated) {
    return <Navigate to="/app/feedback" replace />;
  }

  // Otherwise, render the public component
  return children;
};

export default PublicRoute;
