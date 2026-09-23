// controllers/postController.js

// 1. Import the Post model we created in the models directory.
// The '../' means we go up one directory level from 'controllers' to the project root,
// and then down into the 'models' folder.
const Post = require('../models/postModel');

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
    const { title, markdownContent, author } = req.body;

    // A simple backend validation check.
    if (!title || !markdownContent) {
      // If required fields are missing, send a 400 Bad Request status with a clear error message.
      return res.status(400).json({ message: 'Please provide a title and content for the post.' });
    }

    // 3. Use the Mongoose `create` method on our Post model.
    // This is an async operation, so we use `await`.
    // We pass an object with the data for the new post. The fields should match our Post schema.
    const newPost = await Post.create({
      title,
      markdownContent,
      author, // This will use the provided author or the default 'Admin' from our schema.
    });

    // 4. Send a success response.
    // - HTTP status 201 means "Created". It's the most appropriate status for a successful POST request.
    // - We send back a JSON object containing the newly created post document. This is useful for the client,
    //   which might want to immediately display the new post or redirect to its page.
    res.status(201).json(newPost);

  } catch (error) {
    // 5. Handle potential errors.
    // This could be a validation error from Mongoose (if the data doesn't match the schema)
    // or a database connection issue.
    // We send a 400 Bad Request status, as the error is likely due to invalid data from the client.
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
    // 1. Get page and limit from query parameters, with default values.
    // We use parseInt to convert the string from the query into a number.
    // The || operator provides a default value if one isn't specified in the URL.
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page.

    // 2. Calculate the number of documents to skip.
    // This is the core formula for pagination.
    const skip = (page - 1) * limit;

    // 3. Get the total number of posts in the collection.
    // We need this to calculate the total number of pages.
    // .countDocuments() is much more efficient than fetching all documents and getting the length.
    const totalPosts = await Post.countDocuments();

    // 4. Fetch the posts for the current page.
    // We chain multiple Mongoose methods together to build our final query.
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Sort by creation date, newest first.
      .skip(skip)               // Skip the documents for previous pages.
      .limit(limit);            // Limit the results to the number per page.

    // 5. Send a structured response with pagination metadata.
    // The frontend will need this information to build pagination controls.
    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit), // Calculate total pages.
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
 * @route   GET /api/posts/:id
 * @access  Public
 */
// controllers/postController.js

// ... other controller functions like getAllPosts, createPost, etc.

// We are keeping the other functions (createPost, getAllPosts, etc.) as they are.
// We only need to modify the function for retrieving a single post.

// exports.getPostById = ... (This is the old function you are replacing)

// HIGHLIGHT START
// RENAMED and UPDATED function to fetch a single post by its SLUG
const getPostBySlug = async (req, res) => {
  try {
    // 1. Instead of finding by 'id', we now use Mongoose's findOne() method
    //    to query for a document that has a 'slug' field matching the one
    //    passed in the URL parameters (req.params.slug).
    const post = await Post.findOne({ slug: req.params.slug });

    // 2. Check if a post was actually found.
    //    If no post matches the slug, 'post' will be null.
    if (!post) {
      // If no post is found, it's appropriate to send a 404 Not Found status.
      return res.status(404).json({ message: 'Post not found' });
    }

    // 3. If the post is found, send it back with a 200 OK status.
    res.status(200).json(post);
  } catch (error) {
    // Handle potential server errors (e.g., database connection issue).
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};
// HIGHLIGHT END

// exports.updatePost = ... (This function will also need updating later, but not in this task)
// exports.deletePost = ... (This function will also need updating later, but not in this task)







// --- NEW FUNCTION STARTS HERE ---

/**
 * @desc    Update an existing blog post
 * @route   PATCH /api/posts/:id (or PUT)
 * @access  Public (for now)
 */
const updatePost = async (req, res) => {
  try {
    // 1. Find the post by its ID and update it in a single atomic operation.
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id, // The ID of the post to find
      req.body,      // The data to update with, coming from the request body
      {
        new: true,           // Option to return the document *after* the update has been applied
        runValidators: true, // Option to enforce schema validation rules on the update
      }
    );

    // 2. Check if a post was found and updated.
    if (updatedPost) {
      // If the update was successful, send a 200 OK status with the updated post data.
      res.status(200).json(updatedPost);
    } else {
      // If `findByIdAndUpdate` returns null, it means no document with that ID was found.
      // We send back a 404 Not Found, just like in getPostById.
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    // 3. Handle potential errors.
    console.error(error);

    // Handle invalid ID format (CastError) just like we did in getPostById.
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid post ID format: ${req.params.id}` });
    }
    // Handle validation errors from Mongoose (e.g., a required field is set to empty).
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', error: error.message });
    }

    // For all other errors, send a 500 Internal Server Error.
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
    // 1. Find the post by its ID and delete it in a single atomic operation.
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    // 2. Check if a post was actually found and deleted.
    if (deletedPost) {
      // If the deletion was successful, the `deletedPost` variable will hold the document
      // that was just removed. We send back a 200 OK status with a confirmation message.
      // Another valid approach is to send a 204 No Content status with no body.
      res.status(200).json({ message: 'Post deleted successfully' });
    } else {
      // If `findByIdAndDelete` returns null, no document with that ID was found.
      // We send back a 404 Not Found error.
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    // 3. Handle potential errors.
    console.error(error);

    // Handle invalid ID format (CastError), consistent with our other functions.
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid post ID format: ${req.params.id}` });
    }

    // For all other errors, send a 500 Internal Server Error.
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

// --- NEW FUNCTION ENDS HERE ---

// Update the exports to include our final CRUD function
module.exports = {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
};