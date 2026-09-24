// client/src/pages/UserDashboard.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import './AdminDashboard.css'; // Reuse the same table styles

const UserDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        // Fetch all posts — the backend will return all; we filter client-side
        // to show only posts belonging to the logged-in user.
        // NOTE: A better approach would be a dedicated /api/posts/my-posts endpoint,
        // but we do this here to avoid adding a new backend route per the user's request.
        const response = await apiService.get('/posts/mine');
        setPosts(response.data.posts || response.data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to fetch your posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const handleDelete = async (postId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (!isConfirmed) return;

    try {
      await apiService.delete(`/posts/${postId}`);
      setPosts(currentPosts => currentPosts.filter(post => post._id !== postId));
      alert('Post deleted successfully!');
    } catch (err) {
      console.error('Failed to delete post:', err);
      const msg = err.response?.data?.message || 'Failed to delete the post.';
      alert(msg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) return <div className="loading-message">Loading your posts...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>My Posts</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/create-post" className="create-post-btn">
            + Create New Post
          </Link>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid #dc2626',
              color: '#dc2626',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <table className="posts-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Published Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <Link to={`/edit-post/${post._id}`} className="btn edit-btn">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(post._id)} className="btn delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                You haven't published any posts yet.{' '}
                <Link to="/create-post" style={{ color: '#6366f1', fontWeight: '600' }}>
                  Create your first post!
                </Link>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;
