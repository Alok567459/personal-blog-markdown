// client/src/pages/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
// HIGHLIGHT START
// 1. Import the useNavigate hook from react-router-dom
import { useNavigate } from 'react-router-dom';
// HIGHLIGHT END
import './LoginPage.css';
import apiService from "../services/apiService";
const LoginPage = () => {
  // HIGHLIGHT START
  // 2. Call the useNavigate hook at the top level of the component to get the navigate function.
  const navigate = useNavigate();
  // HIGHLIGHT END
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response =await apiService.post("/auth/login", {
        username,
        password,
      });

      // HIGHLIGHT START
      // 3. Login was successful. Store the token.
      // We use localStorage.setItem() to store the received token.
      // We give it a key, 'token', so we can easily retrieve it later.
      localStorage.setItem('token', response.data.token);

      // 4. Redirect the user to the admin dashboard.
      // The navigate function changes the URL in the browser and renders the
      // component associated with the new route ('/admin/dashboard').
      navigate('/admin/dashboard');
      // HIGHLIGHT END

    } catch (err) {
      console.error('Login failed:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {/* ... form inputs remain the same ... */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;