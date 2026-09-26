// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// --- PUBLIC ROUTES ---
// GET all posts
router.get('/', postController.getAllPosts);

// GET all posts filtered by category (placed before /:slug)
router.get('/category/:categoryName', postController.getPostsByCategory);

// Admin route to get all posts
router.get('/admin/all', protect, isAdmin, postController.getAllPosts);

// GET posts belonging to currently authenticated user
router.get('/mine', protect, postController.getMyPosts);

// Dedicated route to fetch single post by ID
router.get('/id/:id', postController.getPostById);

// GET a single post by slug
router.get('/:slug', postController.getPostBySlug);

// --- PROTECTED ROUTES ---
// POST a new post
router.post('/', protect, postController.createPost);

// PUT (update) an existing post by ID (admin can edit any post, user edits own)
router.put('/:id', protect, postController.updatePost);

// DELETE a post by ID (admin can delete any post, user deletes own)
router.delete('/:id', protect, postController.deletePost);

module.exports = router;