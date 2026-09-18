// routes/postRoutes.js

// 1. Import Express to get access to its Router functionality.
const express = require('express');

// 2. Import the controller functions we created.
// We use object destructuring to pull the functions out of the exports object.
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController');

// 3. Create a new Router instance.
// This `router` object will handle all the routing logic for our post-related endpoints.
const router = express.Router();

// 4. Define the routes.
// We can chain route definitions for the same endpoint path. This is clean and efficient.

// Routes for the collection endpoint ('/api/posts')
// - A GET request to '/' will trigger the getAllPosts controller.
// - A POST request to '/' will trigger the createPost controller.
router.route('/').get(getAllPosts).post(createPost);

// Routes for the specific document endpoint ('/api/posts/:id')
// The ':id' is a URL parameter that Express will capture for us.
// - A GET request to '/:id' will trigger getPostById.
// - A PATCH request to '/:id' will trigger updatePost. (PATCH is for partial updates)
// - A DELETE request to '/:id' will trigger deletePost.
router.route('/:id').get(getPostById).patch(updatePost).delete(deletePost);

// 5. Export the router.
// This makes our configured router available to be used in our main `server.js` file.
module.exports = router;