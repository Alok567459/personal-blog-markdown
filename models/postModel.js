// models/postModel.js

const mongoose = require('mongoose');
// HIGHLIGHT START
// 1. Import the slugify library that we installed.
const slugify = require('slugify');
// HIGHLIGHT END

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
    author: {
      type: String,
      required: [true, 'A post must have an author'],
    },
  },
  {
    timestamps: true,
  }
);

// HIGHLIGHT START
// 2. Define the Mongoose Document Middleware (a pre-save hook).
// This function will run before any document created from this schema is saved.
// We use a standard function() declaration to get access to the 'this' keyword,
// which points to the current document being saved.
postSchema.pre('save', function(next) {
  // 3. We only want to generate a slug if the post is new OR if the title has been modified.
  // If we're just updating the content, we don't want the URL (slug) to change,
  // as this would break existing links to the post.
  if (this.isModified('title')) {
    // 4. Generate the slug from the document's title.
    // The 'this' keyword refers to the document about to be saved.
    // We pass an options object to slugify to make the slug lowercase.
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // 5. Call next() to proceed with the actual save operation.
  // If we don't call next(), the save process will be stuck here forever.
  next();
});
// HIGHLIGHT END

const Post = mongoose.model('Post', postSchema);

module.exports = Post;