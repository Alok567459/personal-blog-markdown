// client/src/pages/PostPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5001/api/posts/${id}`);
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
  }, [id]);

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

  // --- FOCUS ON THIS RENDERING BLOCK ---
  // If loading is false and we have a post object, this is what gets rendered.
  return (
    // We use the <article> semantic tag for a self-contained piece of content like a blog post.
    <article className="post-full">
      {/* Display the post's title in a main heading. */}
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
      
      {/* The main content area of the post. */}
      <div className="post-full-content">
        <h4>Raw Markdown Content:</h4>
        {/*
          For now, we'll display the raw markdown content.
          Using a <pre> tag is ideal for this because it preserves whitespace (like line breaks and indentation)
          and uses a monospaced font, making it look like code.
          This allows us to see exactly what's stored in our database before we parse it.
        */}
        <pre>
          {post.markdownContent}
        </pre>
      </div>
    </article>
  );
};

export default PostPage;