// models/userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose pre-save hook for password hashing (from previous task)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// HIGHLIGHT START
// 1. Define a custom method on the userSchema.
// We attach a function named 'comparePassword' to the 'methods' object of our schema.
// Any document created from this schema will have this method available.
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // 2. Use bcrypt.compare() to check for a match.
    // This is the core of the verification process.
    // - candidatePassword: The plain-text password provided by the user during login.
    // - this.password: The hashed password stored in the database for this specific user document.
    //
    // bcrypt.compare will automatically extract the salt from 'this.password',
    // hash the 'candidatePassword' with that salt, and then securely compare the two hashes.
    // It returns a promise that resolves to true if they match, and false otherwise.
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    // In case of an unexpected error during comparison, we re-throw it to be handled by our controller.
    throw error;
  }
};
// HIGHLIGHT END

const User = mongoose.model('User', userSchema);

module.exports = User;