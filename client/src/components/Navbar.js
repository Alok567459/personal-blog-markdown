// client/src/components/Navbar.js

import React from 'react';
// 1. Import the Link component from react-router-dom
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    // We use a <nav> semantic HTML element for our navigation bar.
    <nav className="navbar">
      {/* A link back to the homepage, often on the site's title or logo */}
      <Link to="/" className="navbar-brand">My Blog</Link>
      
      {/* An unordered list is a common way to structure navigation links */}
      <ul className="navbar-links">
        <li>
          {/* 2. Use the Link component for internal navigation. */}
          {/* The 'to' prop specifies the destination path, which must match a path in your <Route> definitions. */}
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/admin/login">Admin Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;