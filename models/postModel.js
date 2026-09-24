// models/postModel.js

const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A post must have a title'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    markdownContent: {
      type: String,
      required: [true, 'A post must have content'],
    },
    // HIGHLIGHT START
    // 1. Add the new 'categories' field.
    categories: {
      // 2. Define the type as an array of Strings.
      // This is the Mongoose syntax for saying this field will hold a list of string values.
      // e.g., ['React', 'Node.js', 'Tutorial']
      type: [String],
      // 3. We'll add a default value of an empty array.
      // This ensures that new posts without any categories specified
      // will have a 'categories' field, which can prevent potential errors
      // on the frontend if it expects the array to always exist.
      default: [],
    },
    // HIGHLIGHT END
    author: {
      type: String,
      required: [true, 'A post must have an author'],
    },
  },
  {
    // The timestamps option automatically adds createdAt and updatedAt fields.
    timestamps: true,
  }
);

// Mongoose pre-save hook for slug generation
// This logic remains unchanged and will continue to work perfectly.
postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;