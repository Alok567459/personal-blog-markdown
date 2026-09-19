// client/src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

const HomePage = () => {
  // 1. STATE MANAGEMENT
  // Use the useState hook to manage three pieces of state:
  // - posts: an array to hold the blog posts fetched from the API. Initialized to an empty array.
  // - loading: a boolean to indicate when data is being fetched. Initialized to true.
  // - error: a string to hold any error messages. Initialized to null.
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const// client/src/pages/HomePage.js

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

export default HomePage; [error, setError] = useState(null);

  // 2. DATA FETCHING WITH useEffect
  // The useEffect hook runs after the component mounts.
  // The empty dependency array [] ensures this effect runs only once.
  useEffect(() => {
    // We define an async function inside the effect to fetch data.
    const fetchPosts = async () => {
      try {
        // Use axios to send a GET request to our backend API endpoint.
        // Make sure your backend server is running! The URL must match the port your server is on.
        const response = await axios.get('http://localhost:5000/api/posts');
        
        // If the request is successful, update the 'posts' state with the data from the response.
        setPosts(response.data);
        setError(null); // Clear any previous errors
      } catch (err) {
        // If there's an error (e.g., network issue, server down), update the 'error' state.
        setError('Failed to fetch posts. Please try again later.');
        console.error('Error fetching posts:', err); // Log the full error for debugging
      } finally {
        // This block runs regardless of success or failure.
        // We set loading to false because the data fetching process is complete.
        setLoading(false);
      }
    };

    fetchPosts(); // Call the function to execute the data fetch.
  }, []); // The empty array means this effect will only run once, after the initial render.

  // 3. CONDITIONAL RENDERING
  // Based on the state of 'loading' and 'error', we decide what to render.

  // If data is still loading, display a simple loading message.
  if (loading) {
    return <div>Loading posts...</div>;
  }

  // If there was an error fetching data, display the error message.
  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  // 4. RENDER THE POSTS
  // If loading is false and there is no error, we render the list of posts.
  return (
    <div>
      <h1>Blog Posts</h1>
      {/* Check if the posts array is empty. */}
      {posts.length === 0 ? (
        <p>No posts yet. Be the first to create one!</p>
      ) : (
        // If there are posts, map over the array to create a list item for each post.
        // The 'key' prop is essential for React to efficiently update lists. It must be a unique string or number.
        // Here, the post's '_id' from MongoDB is a perfect unique key.
        <ul>
          {posts.map(post => (
            <li key={post._id}>
              <h2>{post.title}</h2>
              <p>by {post.author} on {new Date(post.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;