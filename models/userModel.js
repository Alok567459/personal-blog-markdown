// models/userModel.js

// 1. Import Mongoose to interact with the MongoDB database.
const mongoose = require('mongoose');

// 2. Define the schema for the User collection.
// A schema is a blueprint that defines the structure and properties of documents.
const userSchema = new mongoose.Schema(
  {
    // The 'username' field. This will be used for logging in.
    username: {
      type: String,       // The data type is a string.
      required: true,     // This field must be provided to create a user.
      unique: true,       // No two users can have the same username. Mongoose will create a unique index.
      trim: true,         // Automatically removes any leading or trailing whitespace from the username.
    },
    // The 'password' field.
    password: {
      type: String,       // The data type is a string.
      required: true,     // A password is required.
    },
  },
  {
    // 3. Schema options:
    // The 'timestamps' option tells Mongoose to automatically add two fields to our documents:
    // - createdAt: A timestamp indicating when the document was created.
    // - updatedAt: A timestamp indicating when the document was last updated.
    // This is incredibly useful for tracking and auditing.
    timestamps: true,
  }
);

// 4. Create the Mongoose model from the schema.
// A model is a compiled version of the schema that provides an interface for creating,
// querying, updating, and deleting documents in the associated collection.
// The first argument 'User' is the singular name of the model. Mongoose will automatically
// look for or create a collection with the plural, lowercased version (i.e., 'users').
const User = mongoose.model('User', userSchema);

// 5. Export the model so it can be used in other parts of our application (like our controllers).
module.exports = User;