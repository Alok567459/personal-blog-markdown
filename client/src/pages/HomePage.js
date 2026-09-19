// client/src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// HIGHLIGHT START
// 1. Import the new component we created.
// The path '../components/PostListItem' means "go up one level from 'pages' to 'src',
// then go into the 'components' folder and find PostListItem.js".
import PostListItem from '../components/PostListItem';
// HIGHLIGHT END

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // The useEffect hook for fetching data remains exactly the same.
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/posts');
        setPosts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.length === 0 ? (
        <p>No posts yet. Be the first to create one!</p>
      ) : (
        // HIGHLIGHT START
        // 2. We'll create a <div> to act as a container for our list.
        <div className="post-list">
          {/*
            This is our new, cleaner mapping logic. Instead of complex JSX,
            we now just render our PostListItem component for each post.
          */}
          {posts.map(post => (
            // We pass two props to the PostListItem component: 'key' and 'post'.
            <PostListItem key={post._id} post={post} />
          ))}
        </div>
        // HIGHLIGHT END
      )}
    </div>
  );
};

export default HomePage;