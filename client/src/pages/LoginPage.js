// client/src/pages/LoginPage.js

import React, { useState } from 'react';
// 1. Import the stylesheet we just created
import './LoginPage.css';

const LoginPage = () => {
  // 2. Use the 'useState' hook to create state variables for our form fields.
  // We initialize them with empty strings.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 3. Create a handler function for form submission.
  const handleSubmit = (event) => {
    // a. Prevent the default form submission behavior (which causes a page reload).
    // This is crucial for Single Page Applications (SPAs).
    event.preventDefault();

    // b. For now, we'll just log the credentials to the console to verify
    // that our state management is working correctly.
    console.log('Attempting to log in with:');
    console.log('Username:', username);
    console.log('Password:', password);
    
    // In the next task, we will replace this console.log with an API call.
  };

  return (
    <div className="login-page">
      <h2>Admin Login</h2>
      {/* 4. The form element uses our handleSubmit function for its onSubmit event. */}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            // 5. The input's value is "controlled" by the 'username' state variable.
            value={username}
            // 6. The 'onChange' handler updates the state every time the user types.
            // e.target.value contains the current text inside the input field.
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            // The input's value is controlled by the 'password' state variable.
            value={password}
            // The 'onChange' handler updates the state.
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
