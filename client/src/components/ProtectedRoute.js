// client/src/components/ProtectedRoute.js

import React from 'react';
// 1. Import the 'Navigate' component from react-router-dom.
// This component provides a declarative way to handle redirects in your application.
import { Navigate } from 'react-router-dom';

// 2. Define the ProtectedRoute component.
// It accepts a single prop, 'children', which will be the component(s)
// that this route is protecting (e.g., the <AdminDashboard />).
const ProtectedRoute = ({ children }) => {
  // 3. Check if the authentication token and admin role exist in localStorage.
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // 4. Implement the core logic: the conditional check.
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Restrict access to admin users only
  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // 6. If an admin token is found, allow access.
  return children;
};

export default ProtectedRoute;