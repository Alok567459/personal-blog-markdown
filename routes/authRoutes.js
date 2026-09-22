// routes/authRoutes.js

const express = require('express');
const router = express.Router();

// 1. Import the authentication controller we created earlier.
const authController = require('../controllers/authController');

// 2. Define the login route.
// When a POST request is made to '/api/auth/login',
// it will be handled by the 'login' function in our authController.
router.post('/login', authController.login);

// 3. Export the router so it can be used in server.js
module.exports = router;