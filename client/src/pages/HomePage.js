// client/src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// HIGHLIGHT START
// 1. Import the new component we just created.
import PostListItem from '../components/PostListItem';
// HIGHLIGHT END

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
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
        // 2. We create a <div> to act as a container for our list.
        <div className="post-list">
          {/*
            Instead of complex JSX, we now just render our PostListItem component.
            - The 'key' prop is still essential and MUST be on the top-level element inside the map.
            - The 'post' prop is how we pass the data for a single post down to the child component.
              The name 'post' here must match the destructured name `{ post }` in the child.
          */}
          {posts.map(post => (
            <PostListItem key={post._id} post={post} />
          ))}
        </div>
        // HIGHLIGHT END
      )}
    </div>
  );
};

export default HomePage;