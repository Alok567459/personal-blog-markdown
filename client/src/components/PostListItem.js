// client/src/components/PostListItem.js

import React from 'react';
// HIGHLIGHT START
// 1. Import the Link component from react-router-dom
import CategoryTag from './CategoryTag';

import { Link } from 'react-router-dom';
// HIGHLIGHT END

const categoriesContainerStyle = {
  marginTop: '10px',
};

const PostListItem = ({ post }) => {
  
  return (
    // HIGHLIGHT START
    // 2. Wrap the entire article in a Link component.
    // The 'to' prop is constructed dynamically using a template literal.
    // It creates a unique path for each post, e.g., "/post/60c72b2f9b1e8a5f1c9d9b4c".
    <Link to={`/post/${post.slug}`} className="post-link">
      <article className="post-list-item">
        <h2>{post.title}</h2>
        <div className="post-meta">
          <span>by {post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>


        {/* HIGHLIGHT START */}
      {/* 2. Conditionally render the categories container.
           We only show this section if the 'categories' array exists AND it's not empty.
           This is a crucial check to prevent errors for posts without categories. */}
      {post.categories && post.categories.length > 0 && (
        <div style={categoriesContainerStyle}>
          {/* 3. Map over the categories array. For each category string,
               render our reusable CategoryTag component.
               The category string itself makes a good unique 'key'. */}
          {post.categories.map(category => (
            <CategoryTag key={category} category={category} />
          ))}
        </div>
      )}
      {/* HIGHLIGHT END */}
      </article>
    </Link>
    // HIGHLIGHT END
  );
};

export default PostListItem;