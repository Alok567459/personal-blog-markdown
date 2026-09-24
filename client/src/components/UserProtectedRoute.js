// client/src/components/UserProtectedRoute.js
// Protects routes that require ANY authenticated user (regular user or admin).

import React from 'react';
import { Navigate } from 'react-router-dom';

const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // No token → redirect to login
    return <Navigate to="/login" replace />;
  }

  // Token exists — allow access
  return children;
};

export default UserProtectedRoute;
