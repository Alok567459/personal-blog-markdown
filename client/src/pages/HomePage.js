// client/src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import PostListItem from '../components/PostListItem'; // Assuming you have this component
import './HomePage.css'; // Import the new stylesheet
import { Helmet } from 'react-helmet-async';
const HomePage = () => {
  // 1. Existing state for posts, loading, and error.
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 2. NEW state for pagination.
  // We start on page 1.
  const [currentPage, setCurrentPage] = useState(1);
  // We don't know the total pages yet, so we start with null.
  const [totalPages, setTotalPages] = useState(null);

  // 3. Update useEffect to be aware of the currentPage.
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      try {
        // 4. Make the API request with pagination query parameters.
        // We ask for the data for the 'currentPage' with a limit of 10 posts.
        const response = await apiService.get(`/posts?page=${currentPage}&limit=10`);

        // 5. The backend now returns a structured object. We destructure it.
        const { posts: fetchedPosts, totalPages: fetchedTotalPages } = response.data;
        
        setPosts(fetchedPosts);
        setTotalPages(fetchedTotalPages);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]); // 6. The CRUCIAL dependency array. This effect re-runs whenever 'currentPage' changes.

  // 7. Handler functions for our pagination buttons.
  const handleNextPage = () => {
    // We only move to the next page if we're not already on the last page.
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    // We only move to the previous page if we're not on the first page.
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // UI Rendering Logic
  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home-page">
      <h1>Latest Posts</h1>

      {/* HIGHLIGHT START */}
      {/* 2. Add the Helmet component. It can be placed anywhere in the return JSX.
           Anything you put inside it will be injected into the document's <head>. */}
      <Helmet>
        <title>My Awesome Blog - Latest Posts</title>
        <meta 
          name="description" 
          content="Welcome to My Awesome Blog. Read the latest articles on web development, technology, and more." 
        />
      </Helmet>
      {/* HIGHLIGHT END */}

      
      <div className="post-list">
        {posts.length > 0 ? (
          posts.map(post => <PostListItem key={post._id} post={post} />)
        ) : (
          <p>No posts to display.</p>
        )}
      </div>

      {/* 8. Render the pagination controls only if there are posts and pages. */}
      {totalPages > 0 && (
        <div className="pagination-controls">
          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>
          <div className="pagination-buttons">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1} // Disable if on the first page
              className="btn"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages} // Disable if on the last page
              className="btn"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;