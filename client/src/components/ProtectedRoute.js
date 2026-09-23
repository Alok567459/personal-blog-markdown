// client/src/components/ProtectedRoute.js

import React from 'react';
// 1. Import the 'Navigate' component from react-router-dom.
// This component provides a declarative way to handle redirects in your application.
import { Navigate } from 'react-router-dom';

// 2. Define the ProtectedRoute component.
// It accepts a single prop, 'children', which will be the component(s)
// that this route is protecting (e.g., the <AdminDashboard />).
const ProtectedRoute = ({ children }) => {
  // 3. Check if the authentication token exists in localStorage.
  // This is our simple yet effective way of determining if a user is "logged in".
  const token = localStorage.getItem('token');

  // 4. Implement the core logic: the conditional check.
  if (!token) {
    // If no token is found, it means the user is not authenticated.
    // We must prevent them from accessing the protected content.

    // 5. Redirect the user to the login page.
    // Rendering the <Navigate> component will cause react-router to change
    // the URL and render the component for the '/admin/login' route instead.
    // The 'replace' prop is a crucial piece of UX: it replaces the current
    // entry in the browser's history stack instead of pushing a new one.
    // This prevents the user from being able to click the "back" button
    // and re-access the protected route after being redirected.
    return <Navigate to="/admin/login" replace />;
  }

  // 6. If a token is found, the user is authenticated.
  // We simply return the 'children' prop. React will render whatever
  // component was passed inside our ProtectedRoute (e.g., <AdminDashboard />).
  return children;
};

export default ProtectedRoute;