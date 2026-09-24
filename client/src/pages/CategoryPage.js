// client/src/pages/CategoryPage.js

import React, { useState, useEffect } from 'react';
// 1. Import the useParams hook to read the category name from the URL.
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // For SEO
import apiService from '../services/apiService';

// 2. We will reuse these for a consistent user experience.
import PostListItem from '../components/PostListItem';
import './HomePage.css'; // Reusing styles from HomePage for layout consistency

const CategoryPage = () => {
  // 3. Use useParams to get the dynamic part of the URL.
  // The key 'categoryName' must match the parameter name you defined
  // in your App.js route: '/category/:categoryName'.
  const { categoryName } = useParams();

  // 4. Set up state for posts, loading, and errors, just like on the HomePage.
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 5. Use useEffect to fetch data whenever the categoryName from the URL changes.
  useEffect(() => {
    // We define an async function inside the effect to perform the data fetching.
    const fetchPostsByCategory = async () => {
      // Reset state for new fetch
      setLoading(true);
      setError('');
      try {
        // 6. Make the API call to our dedicated category endpoint.
        // The 'categoryName' from the URL is used to build the request URL.
        const response = await apiService.get(`/posts/category/${categoryName}`);
        setPosts(response.data);
      } catch (err) {
        console.error(`Failed to fetch posts for category ${categoryName}:`, err);
        setError('Could not load posts for this category. Please try again.');
      } finally {
        // Ensure loading is set to false after the fetch completes or fails.
        setLoading(false);
      }
    };

    fetchPostsByCategory();
    
    // 7. The dependency array [categoryName] is crucial. It tells React to re-run
    // this effect (and thus re-fetch data) if the user navigates from one
    // category page to another (e.g., from /category/React to /category/Node).
  }, [categoryName]);

  // --- UI Rendering Logic ---

  // Display a loading message while data is being fetched.
  if (loading) {
    return <div className="loading-message">Loading posts...</div>;
  }

  // Display an error message if the API call failed.
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    // We reuse the 'home-page' class for consistent layout and styling.
    <div className="home-page">
      <Helmet>
        <title>{`Posts in "${categoryName}" | My Awesome Blog`}</title>
        <meta name="description" content={`Browse all posts categorized under "${categoryName}" on My Awesome Blog.`} />
      </Helmet>

      {/* 8. Display a clear, dynamic heading to provide context to the user. */}
      <h1>Posts in: "{categoryName}"</h1>

      <div className="post-list">
        {/* 9. If posts are found, map over them and render a PostListItem for each one.
             This is the power of component reuse! */}
        {posts.length > 0 ? (
          posts.map(post => <PostListItem key={post._id} post={post} />)
        ) : (
          // 10. If the API returns an empty array, show a helpful message.
          <p>No posts found in this category yet.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;