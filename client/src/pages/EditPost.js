// client/src/pages/EditPost.js

import React, { useState, useEffect } from 'react';
// 1. Import the necessary hooks from react-router-dom
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../services/apiService';
// 2. We reuse the same CSS as the CreatePost page.
import './CreatePost.css';

const EditPost = () => {
  // 3. Get the post ID from the URL parameters using the useParams hook.
  const { id } = useParams();

  // 4. Set up state for form fields, loading, and errors.
  const [title, setTitle] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [error, setError] = useState('');
  // We add an extra loading state for the initial data fetch.
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // 5. Use useEffect to fetch the post data when the component mounts.
  // The dependency array [id] ensures this effect runs whenever the post ID from the URL changes.
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/posts/${id}`);
        // 6. Once data is fetched, populate the form's state.
        setTitle(response.data.title);
        setMarkdownContent(response.data.markdownContent);
      } catch (err) {
        console.error('Failed to fetch post for editing:', err);
        setError('Failed to load post data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // 7. Handler for the form submission.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    if (!title.trim() || !markdownContent.trim()) {
      setError('Title and content are required.');
      setSubmitting(false);
      return;
    }

    try {
      // 8. Send a PUT request to the backend with the updated data.
      // The endpoint is the same as the GET endpoint, but the method is PUT.
      await apiService.put(`/posts/${id}`, {
        title,
        markdownContent,
      });

      // 9. On success, navigate back to the dashboard.
      navigate('/admin/dashboard');

    } catch (err) {
      console.error('Failed to update post:', err);
      setError(err.response?.data?.message || 'Failed to update post. Please try again.');
      setSubmitting(false);
    }
  };

  // 10. Show a loading message while fetching initial data.
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading post...</div>;
  }

  return (
    <div className="create-post-page">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="markdownContent">Content (Markdown)</label>
          <textarea
            id="markdownContent"
            className="form-control markdown-input"
            value={markdownContent}
            onChange={(e) => setMarkdownContent(e.target.value)}
            disabled={submitting}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
};

export default EditPost;