// client/src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import apiService from '../services/apiService';

const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiService.post('/auth/login', {
        username,
        password,
      });

      // Store token and role
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      if (response.data.user) {
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('username', response.data.user.username);
      }

      // Redirect based on role
      if (response.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }

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
      <h2>Log In</h2>
      <form onSubmit={handleSubmit} className="login-form">
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
      <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.92rem', color: '#6b7280' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}>
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
