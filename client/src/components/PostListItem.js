// client/src/components/PostListItem.js

import React from 'react';
// HIGHLIGHT START
// 1. Import the Link component from react-router-dom
import { Link } from 'react-router-dom';
// HIGHLIGHT END

const PostListItem = ({ post }) => {
  const snippet = post.markdownContent
    .replace(/[#*`]/g, '')
    .substring(0, 150) + '...';

  return (
    // HIGHLIGHT START
    // 2. Wrap the entire article in a Link component.
    // The 'to' prop is constructed dynamically using a template literal.
    // It creates a unique path for each post, e.g., "/post/60c72b2f9b1e8a5f1c9d9b4c".
    <Link to={`/post/${post._id}`} className="post-link">
      <article className="post-list-item">
        <h2>{post.title}</h2>
        <div className="post-meta">
          <span>by {post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <p>{snippet}</p>
      </article>
    </Link>
    // HIGHLIGHT END
  );
};

export default PostListItem;