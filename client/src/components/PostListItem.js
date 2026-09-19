// client/src/components/PostListItem.js

import React from 'react';

// This is a functional component that accepts 'props' as its argument.
// We are using ES6 object destructuring to directly access the 'post' object from the props.
// So instead of writing `props.post.title`, we can just write `post.title`.
const PostListItem = ({ post }) => {

  // Create a snippet from the markdown content.
  // We'll remove markdown characters like '#' and '*' for a cleaner preview,
  // then take the first 150 characters and add an ellipsis.
  const snippet = post.markdownContent
    .replace(/[#*`]/g, '') // A simple regex to remove common markdown characters
    .substring(0, 150) + '...';

  return (
    // We'll use a semantic <article> tag and give it a class for styling.
    <article className="post-list-item">
      <h2>{post.title}</h2>
      <div className="post-meta">
        <span>by {post.author}</span>
        {/* We format the ISO date string into a more readable local date format. */}
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <p>{snippet}</p>
    </article>
  );
};

export default PostListItem;