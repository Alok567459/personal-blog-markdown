// client/src/pages/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ... The initial data fetching logic remains exactly the same.
    const fetchPosts = async () => {
      try {
        const response = await apiService.get('/posts');
        setPosts(response.data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to fetch posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // HIGHLIGHT START
  // 1. Define the handler function for deleting a post.
  // It's an 'async' function because it performs an API call.
  // It takes the 'postId' as an argument to know which post to delete.
  const handleDelete = async (postId) => {
    // 2. Ask for user confirmation before proceeding with a destructive action.
    // window.confirm() shows a simple browser dialog and returns true (if OK is clicked) or false.
    const isConfirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');

    // 3. If the user cancels, do nothing.
    if (!isConfirmed) {
      return;
    }

    try {
      // 4. If confirmed, make the authenticated DELETE request using our apiService.
      // We use a template literal to dynamically insert the postId into the URL.
      await apiService.delete(`/posts/${postId}`);

      // 5. On successful deletion, update the local state to remove the post from the UI.
      // This is a crucial step for a good user experience.
      // We use the functional form of setPosts to ensure we're working with the latest state.
      // The .filter() method creates a NEW array containing only the posts whose _id does NOT match the deleted postId.
      // This is the correct, immutable way to remove an item from state in React.
      setPosts(currentPosts => currentPosts.filter(post => post._id !== postId));
      
      alert('Post deleted successfully!');

    } catch (err) {
      // 6. If the API call fails, log the error and inform the user.
      console.error('Failed to delete post:', err);
      alert('Failed to delete the post. Please try again.');
    }
  };
  // HIGHLIGHT END

  if (loading) {
    return <div className="loading-message">Loading posts...</div>;
  }
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Manage Posts</h2>
        {/* HIGHLIGHT START */}
        {/* Add a Link component that navigates to our new page */}
        <Link to="/admin/create-post" className="create-post-btn">
          + Create New Post
        </Link>
        {/* HIGHLIGHT END */}
      </div>

      <table className="posts-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <Link to={`/admin/edit-post/${post._id}`} className="btn edit-btn">
                    Edit
                  </Link>

                  {/* HIGHLIGHT START */}
                  {/* 7. Attach the handleDelete function to the onClick event of the button.
                      We use an arrow function () => ... to ensure that handleDelete(post._id)
                      is only CALLED when the button is clicked, not during the render.
                      This also allows us to pass the specific post._id to our handler. */}
                  <button onClick={() => handleDelete(post._id)} className="btn delete-btn">
                    Delete
                  </button>
                  {/* HIGHLIGHT END */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No posts found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;