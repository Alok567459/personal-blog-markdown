// client/src/services/apiService.js

import axios from 'axios';

// 1. Create a new Axios instance with a custom configuration.
// We are not modifying the global axios instance. This is a best practice.
const apiService = axios.create({
  // 2. Set a base URL for all requests.
  // This means that for any request made with this instance,
  // 'http://localhost:5000/api' will be prepended to the URL.
  // For example, apiService.get('/posts') will make a GET request to 'http://localhost:5000/api/posts'.
  baseURL: 'http://localhost:5001/api',
});

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