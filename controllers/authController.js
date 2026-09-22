// controllers/authController.js

// 1. Import necessary modules and models
const jwt = require('jsonwebtoken'); // To generate and sign tokens
const User = require('../models/userModel'); // The User model we created

// 2. Define the login function
// This will be an asynchronous function as we'll be interacting with the database.
exports.login = async (req, res) => {
  try {
    // 3. Extract username and password from the request body
    const { username, password } = req.body;

    // 4. Validate input: Check if username and password exist
    if (!username || !password) {
      // If either is missing, send a 400 Bad Request response.
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a username and password.',
      });
    }

    // 5. Find the user in the database
    // We explicitly ask to include the password field using .select('+password').
    // It's good practice to set 'select: false' on password fields in the schema
    // and only include it when needed, like here for authentication.
    const user = await User.findOne({ username }).select('+password');

    // 6. Check if user exists AND if the password is correct
    // We use our custom 'comparePassword' method from the userModel.
    // It's crucial to check for the user's existence first to avoid errors.
    // We send a generic "Invalid credentials" message for both cases (user not found or wrong password)
    // to prevent "username enumeration" attacks, where an attacker could guess valid usernames.
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials.',
      });
    }

    // 7. If credentials are correct, create and sign a JWT
    const payload = { id: user._id }; // The payload contains the user's unique ID.

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // 8. Send the token back to the client
    res.status(200).json({
      status: 'success',
      token,
    });

  } catch (error) {
    // 9. Handle any unexpected server errors
    console.error('LOGIN ERROR:', error);
    res.status(500).json({
      status: 'error',
      message: 'An internal server error occurred.',
    });
  }
};