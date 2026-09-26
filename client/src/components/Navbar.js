// client/src/components/Navbar.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication state (token and role)
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  // Theme state: 'dark' or 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Keep auth state synchronized on route changes
  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setRole(localStorage.getItem('role'));
  }, [location]);

  // Synchronize theme with <html> class and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // Dark / Light toggle handler
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    navigate('/login');
  };

  const isAdmin = Boolean(token && role === 'admin');
  const isUser = Boolean(token && role !== 'admin');

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">✍️</span>
          <span>My Blog</span>
          {isAdmin && <span className="admin-badge">Admin</span>}
        </Link>

        {/* Right side: navigation links & theme toggle button */}
        <div className="navbar-right">
          <ul className="navbar-links">
            <li>
              <Link to="/" className="nav-link">Home</Link>
            </li>

            {/* Admin navigation after login: full access to manage all posts */}
            {isAdmin && (
              <>
                <li>
                  <Link to="/admin/dashboard" className="nav-link">
                    Admin Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/admin/create-post" className="nav-link nav-btn-primary">
                    + New Post
                  </Link>
                </li>
              </>
            )}

            {/* Regular authenticated user navigation */}
            {isUser && (
              <>
                <li>
                  <Link to="/dashboard" className="nav-link">
                    My Posts
                  </Link>
                </li>
                <li>
                  <Link to="/create-post" className="nav-link nav-btn-primary">
                    + New Post
                  </Link>
                </li>
              </>
            )}

            {/* Guest navigation */}
            {!token && (
              <>
                <li>
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li>
                  <Link to="/signup" className="nav-link nav-btn-primary">
                    Sign Up
                  </Link>
                </li>
              </>
            )}

            {/* Logout button */}
            {token && (
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="logout-btn"
                  title="Log Out"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>

          {/* Dark Mode / Light Mode Toggle Button */}
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <>
                <span className="theme-toggle-icon">☀️</span>
                <span className="theme-toggle-text">Light</span>
              </>
            ) : (
              <>
                <span className="theme-toggle-icon">🌙</span>
                <span className="theme-toggle-text">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;