// client/src/services/apiService.js

import axios from 'axios';

// 1. Create a new Axios instance with a custom configuration.
// We are not modifying the global axios instance. This is a best practice.
// HIGHLIGHT START
// 2. Create the Axios instance with a dynamic baseURL.
//    - When you run `npm start` locally, `process.env.REACT_APP_API_URL` will be read
//      from your `client/.env` file and will be 'http://localhost:5000/api'.
//    - When Vercel runs `npm run build`, it will inject the environment variable you set
//      in the Vercel dashboard, making it 'https://your-backend-name.onrender.com/api'.
const apiService = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    // 3. Conditionally add the Authorization header if a token exists.
    
  },
});
// HIGHLIGHT END


// 3. Set up a request interceptor.
// This function will be called for EVERY request made using this 'apiService' instance.
apiService.interceptors.request.use(
  (config) => {
    // 4. Before the request is sent, get the token from localStorage.
    const token = localStorage.getItem('token');

    // 5. If a token exists, add it to the 'Authorization' header.
    // The backend's 'protect' middleware is specifically looking for this header.
    if (token) {
      // The 'Bearer' scheme is the standard for sending JWTs.
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // 6. Crucially, we return the modified config object so the request can proceed.
    return config;
  },
  (error) => {
    // 7. If an error occurs during the request setup, we pass it along.
    // This is for handling errors before the request is even sent.
    return Promise.reject(error);
  }
);

// 8. Export the configured instance as the default export of this module.
// Now, other parts of our application can import and use this pre-configured instance
// instead of the default axios object.
export default apiService;