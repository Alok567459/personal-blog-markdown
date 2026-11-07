// client/src/pages/PostPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';
// HIGHLIGHT START
// Import the default export from the 'react-markdown' package we just installed.
// The name 'ReactMarkdown' is the conventional name for this component.
// This line tells our file: "I need to use the main component from the 'react-markdown' library."
import ReactMarkdown from 'react-markdown';
// HIGHLIGHT END
import apiService from '../services/apiService';
import '../markdown-styles.css';
import CategoryTag from '../components/CategoryTag';


const PostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Authentication & authorization details
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  let userId = localStorage.getItem('userId');
  let username = localStorage.getItem('username');

  // Fallback: extract user id from token payload if not directly in localStorage
  if (token && (!userId || !role)) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!userId && payload.id) userId = payload.id;
    } catch (e) {
      // ignore
    }
  }

  // Authorization check for post management:
  // Admin can edit/delete ANY post.
  // Normal user can only edit/delete their OWN post.
  const isOwner = Boolean(
    post &&
    ((userId && (String(post.authorId) === String(userId) || String(post.user) === String(userId))) ||
     (username && post.author === username))
  );
  const isAdmin = Boolean(token && role === 'admin');
  const canManagePost = isAdmin || isOwner;

  const handleDelete = async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (!isConfirmed) return;

    try {
      await apiService.delete(`/posts/${post._id}`);
      alert('Post deleted successfully!');
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
      const msg = err.response?.data?.message || 'Failed to delete the post. Please try again.';
      alert(msg);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.get(`/posts/${slug}`);
        setPost(response.data);
      } catch (err) {
        console.error("Error fetching post:", err);
        if (err.response && err.response.status === 404) {
          setError('Post not found.');
        } else {
          setError('Failed to load the post. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);


  // A helper function to create a short, clean description from the markdown content.
  const createMetaDescription = (markdown) => {
    if (!markdown) return '';
    // Remove Markdown formatting and trim to a suitable length (e.g., 155 chars).
    const plainText = markdown
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Keep link text
      .replace(/[`*#_~]/g, '') // Remove markdown characters
      .replace(/\s+/g, ' '); // Normalize whitespace
    
    return plainText.substring(0, 155).trim() + '...';
  };


  if (loading) {
    return <div>Loading post...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>Error: {error}</div>;
  }

  // This check is a final safeguard. If loading is done but there's still no post,
  // it means the fetch was successful but returned no data (which our API doesn't do, but it's good practice).
  if (!post) {
    return <div>Post not found.</div>;
  }
  const categoriesContainerStyle = {
    marginTop: '1rem',
    marginBottom: '1rem',
    borderBottom: '1px solid var(--border-color, #eee)',
    paddingBottom: '1rem'
  };


  // --- FOCUS ON THIS RENDERING BLOCK ---
  // If loading is false and we have a post object, this is what gets rendered.
  return (
    // We use the <article> semantic tag for a self-contained piece of content like a blog post.
    <article className="post-full">


      <Helmet>
        {/* We create a dynamic title using the post's title. */}
        <title>{`${post.title} | My Awesome Blog`}</title>
        {/* We create a dynamic meta description from the post's content. */}
        <meta 
          name="description" 
          content={createMetaDescription(post.markdownContent)} 
        />
      </Helmet>
      
      <h1>{post.title}</h1>
      
      {/* A metadata section for author and publication date. */}
      <div className="post-full-meta">
        <span>by {post.author}</span>
        
        {/*
          'post.createdAt' from MongoDB is an ISO 8601 date string (e.g., "2023-10-27T10:00:00.000Z").
          We create a new JavaScript Date object from it and then use .toLocaleDateString()
          to format it into a user-friendly, locale-aware format (e.g., "10/27/2023" in the US).
        */}
        <span>Published on {new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Role-based action controls: Admin sees on all posts; author sees on own posts */}
      {canManagePost && (
        <div className="post-actions" style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', marginBottom: '1rem' }}>
          <Link
            to={isAdmin ? `/admin/edit-post/${post._id}` : `/edit-post/${post._id}`}
            className="btn edit-btn"
            style={{
              padding: '0.45rem 1rem',
              backgroundColor: '#007bff',
              color: '#ffffff',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '0.9rem',
              display: 'inline-block',
            }}
          >
            Edit Post
          </Link>
          <button
            onClick={handleDelete}
            className="btn delete-btn"
            style={{
              padding: '0.45rem 1rem',
              backgroundColor: '#dc3545',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.9rem',
            }}
          >
            Delete Post
          </button>
        </div>
      )}
      
      {/* HIGHLIGHT START */}
      {/* 2. Add the exact same conditional rendering and mapping logic here.
           This is the beauty of a reusable component! */}
      {post.categories && post.categories.length > 0 && (
        <div style={categoriesContainerStyle}>
          {post.categories.map(category => (
            <CategoryTag key={category} category={category} />
          ))}
        </div>
      )}
      {/* HIGHLIGHT END */}
      <div className="post-full-content">
        {/*
          The ReactMarkdown component is used here.
          The markdown string from our post object (`post.markdownContent`)
          is passed as a 'child' to the component. The component will
          automatically parse this string and render the corresponding HTML elements.
        */}
        <ReactMarkdown>{post.markdownContent}</ReactMarkdown>
      </div>
    </article>
  );
};

export default PostPage;