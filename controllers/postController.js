// controllers/postController.js

// 1. Import required libraries and models.
const mongoose = require('mongoose');
const slugify = require('slugify');
const Post = require('../models/postModel');
const summaryService = require('../services/summaryService');

/**
 * @desc    Create a new blog post
 * @route   POST /api/posts
 * @access  Public (for now)
 */
const createPost = async (req, res) => {
  // All controller logic that interacts with the database should be wrapped in a try...catch block
  // to handle potential errors gracefully.
  try {
    // 2. Destructure the required fields from the request body.
    // The `req.body` object contains the JSON data sent by the client, thanks to our `express.json()` middleware.
    const { title, markdownContent, categories } = req.body;

    // A simple backend validation check.
    if (!title || !markdownContent) {
      // If required fields are missing, send a 400 Bad Request status with a clear error message.
      return res.status(400).json({ message: 'Please provide a title and content for the post.' });
    }

    // 3. Use the Mongoose `create` method on our Post model.
    // We store authorId and user (the logged-in user's _id) and use their username as the author name.
    const newPost = await Post.create({
      title,
      markdownContent,
      categories,
      author: req.user.username,   // Use the logged-in user's username
      authorId: req.user._id,      // Store the user's ObjectId for ownership checks
      user: req.user._id,          // Store post.user for expected authorization checks
    });

    // 4. Send a success response.
    res.status(201).json(newPost);

  } catch (error) {
    // 5. Handle potential errors.
    console.error(error); // Log the full error to the console for debugging.
    res.status(400).json({ message: 'Error creating post', error: error.message });
  }
};



// --- NEW FUNCTION STARTS HERE ---

/**
 * @desc    Get all blog posts
 * @route   GET /api/posts
 * @access  Public
 */
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const isAll = req.query.limit === 'all';
    const limit = isAll ? 0 : (parseInt(req.query.limit) || 10);

    const totalPosts = await Post.countDocuments();

    let query = Post.find().sort({ createdAt: -1 });
    if (!isAll && limit > 0) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const posts = await query;

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: isAll || limit === 0 ? 1 : Math.ceil(totalPosts / limit),
      totalPosts,
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// --- NEW FUNCTION ENDS HERE ---




// --- NEW FUNCTION STARTS HERE ---

/**
 * @desc    Get a single blog post by its ID
 * @route   GET /api/posts/id/:id
 * @access  Public
 */
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid post ID format: ${req.params.id}` });
    }
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

/**
 * @desc    Get a single blog post by its SLUG or ID
 * @route   GET /api/posts/:slug
 * @access  Public
 */
const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // 1. Search by slug first
    let post = await Post.findOne({ slug });

    // 2. If not found by slug, and slug is a valid MongoDB ObjectId, search by _id
    // This allows requests using post._id (such as from the Edit Post page) to succeed seamlessly.
    if (!post && mongoose.Types.ObjectId.isValid(slug)) {
      post = await Post.findById(slug);
    }

    // 3. Check if a post was actually found.
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // 4. Send the post back with a 200 OK status.
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

// exports.updatePost = ... (This function will also need updating later, but not in this task)
// exports.deletePost = ... (This function will also need updating later, but not in this task)


// HIGHLIGHT START
// NEW function to fetch all posts that belong to a specific category.
const getPostsByCategory = async (req, res) => {
  try {
    // 1. Extract the category name from the URL parameters.
    // This 'categoryName' corresponds to the ':categoryName' in our route definition.
    const categoryName = req.params.categoryName;

    // 2. Use Mongoose's find() method to query the database.
    // We are looking for all documents where the 'categories' array field
    // contains the string value of 'categoryName'.
    // Mongoose is smart enough to search for a value within the array.
    const posts = await Post.find({ categories: categoryName })
      .sort({ createdAt: -1 }); // Optional: sort the results by newest first.

    // 3. If no posts are found for a category, Mongoose returns an empty array.
    // This is a valid result, not an error. We simply return the empty array.

    // 4. Send the found posts back to the client with a 200 OK status.
    res.status(200).json(posts);
  } catch (error) {
    // Handle potential server errors (e.g., database connection issue).
    res.status(500).json({ message: 'Error fetching posts by category', error: error.message });
  }
};
// HIGHLIGHT END






// --- NEW FUNCTION STARTS HERE ---

/**
 * @desc    Update an existing blog post
 * @route   PATCH /api/posts/:id (or PUT)
 * @access  Public (for now)
 */
const updatePost = async (req, res) => {
  try {
    const { title, markdownContent, categories } = req.body;

    // First, find the post to check ownership
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Authorization check:
    // If user.id === post.user -> allow
    // Else if user.role === "admin" -> allow
    // Otherwise -> return 403 Forbidden
    const currentUserId = String(req.user._id || req.user.id);
    const postUserId = post.user ? String(post.user) : (post.authorId ? String(post.authorId) : null);
    const isOwner = postUserId && (currentUserId === postUserId);
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to edit this post.' });
    }

    // Build the update payload
    const updatedData = {
      title,
      markdownContent,
      categories,
    };

    // If the title was updated, regenerate the slug as well
    if (title) {
      updatedData.slug = slugify(title, { lower: true, strict: true });
    }

    // Apply the update
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedPost);

  } catch (error) {
    console.error(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid post ID format: ${req.params.id}` });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A post with this title already exists. Please choose a different title.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', error: error.message });
    }

    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

// --- NEW FUNCTION ENDS HERE ---

// --- NEW FUNCTION STARTS HERE ---

/**
 * @desc    Delete a blog post
 * @route   DELETE /api/posts/:id
 * @access  Public (for now)
 */
const deletePost = async (req, res) => {
  try {
    // 1. Find the post first to check ownership
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Authorization check:
    // If user.id === post.user -> allow
    // Else if user.role === "admin" -> allow
    // Otherwise -> return 403 Forbidden
    const currentUserId = String(req.user._id || req.user.id);
    const postUserId = post.user ? String(post.user) : (post.authorId ? String(post.authorId) : null);
    const isOwner = postUserId && (currentUserId === postUserId);
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to delete this post.' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });

  } catch (error) {
    // Handle potential errors.
    console.error(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid post ID format: ${req.params.id}` });
    }

    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

// --- NEW FUNCTION ENDS HERE ---

// Update the exports to include our final CRUD function
/**
 * @desc    Get all posts belonging to the currently authenticated user
 * @route   GET /api/posts/mine
 * @access  Protected
 */
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      $or: [{ authorId: req.user._id }, { user: req.user._id }],
    }).sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your posts', error: error.message });
  }
};

/**
 * @desc    Generate or retrieve an AI-powered 3-5 sentence summary for a post
 * @route   POST /api/posts/:id/summary
 * @access  Public
 */
const summarizePost = async (req, res) => {
  try {
    const { id } = req.params;
    let post = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      post = await Post.findById(id);
    }
    if (!post) {
      post = await Post.findOne({ slug: id });
    }

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Reuse existing summary if already generated and saved in MongoDB
    const force = req.query.force === 'true' || req.body?.force === true;
    if (!force && post.summary && typeof post.summary === 'string' && post.summary.trim() !== '') {
      return res.status(200).json({
        success: true,
        summary: post.summary,
        cached: true,
        message: 'Summary retrieved from database',
      });
    }

    if (!post.markdownContent || typeof post.markdownContent !== 'string' || post.markdownContent.trim() === '') {
      return res.status(400).json({
        message: 'Cannot generate summary: post does not contain any content.',
      });
    }

    // Generate 3-5 sentence summary using Gemini API via summaryService
    const summary = await summaryService.generateSummary(post.markdownContent);

    // Save generated summary in MongoDB
    post.summary = summary;
    await post.save();

    return res.status(200).json({
      success: true,
      summary: post.summary,
      cached: false,
      message: 'Summary generated and saved successfully',
    });
  } catch (error) {
    console.error('Error in summarizePost controller:', error);
    const statusCode = error.status || error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || 'Failed to generate post summary',
      error: error.message,
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getPostBySlug,
  getPostsByCategory,
  getMyPosts,
  updatePost,
  deletePost,
  summarizePost,
};