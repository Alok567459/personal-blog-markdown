// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
// HIGHLIGHT START
// 1. Import the 'protect' middleware from our authMiddleware file.
const { protect } = require('../middleware/authMiddleware');
// HIGHLIGHT END

// --- PUBLIC ROUTES ---
// These routes are for reading data and should be accessible to everyone.
// GET all posts
router.get('/', postController.getAllPosts);
// GET a single post by its ID



// HIGHLIGHT START
// NEW ROUTE: GET all posts filtered by a specific category.
// This route must be placed *before* the '/:slug' route. Express matches routes
// in order, and if '/:slug' came first, it would incorrectly interpret 'category'
// as a slug.
router.get('/category/:categoryName', postController.getPostsByCategory);
// HIGHLIGHT END


// Dedicated route to fetch a single post by ID
router.get('/id/:id', postController.getPostById);

// HIGHLIGHT START
// GET a single post by its SLUG or ID
// 1. The URL parameter is changed from ':id' to ':slug'.
// 2. We point this route to our new 'getPostBySlug' controller function.
router.get('/:slug', postController.getPostBySlug);
// HIGHLIGHT END


// --- PROTECTED ADMIN ROUTES ---
// These routes are for modifying data and must be protected.
// A user must be logged in as an admin to access them.

// POST a new post
// HIGHLIGHT START
// 2. We add 'protect' as the second argument. This inserts it into the request chain.
// The request will first go through the 'protect' middleware.
// If authentication is successful, next() is called, and the request proceeds to 'createPost'.
// If authentication fails, the middleware sends an error response, and 'createPost' is never reached.
router.post('/', protect, postController.createPost);
// HIGHLIGHT END

// PUT (update) an existing post by its ID
// HIGHLIGHT START
router.put('/:id', protect, postController.updatePost);
// HIGHLIGHT END

// DELETE a post by its ID
// HIGHLIGHT START
router.delete('/:id', protect, postController.deletePost);
// HIGHLIGHT END

module.exports = router;