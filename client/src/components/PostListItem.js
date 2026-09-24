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
    <div className="post-list-item">
      <h2>
        <Link to={`/post/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="post-meta">
        By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
      </p>

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
    </div>
  );
};

export default PostListItem;