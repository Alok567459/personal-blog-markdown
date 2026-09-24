// client/src/components/CategoryTag.js

import React from 'react';
// HIGHLIGHT START
// 1. Import the Link component from react-router-dom.
import { Link } from 'react-router-dom';
// HIGHLIGHT END
import './CategoryTag.css';

const CategoryTag = ({ category }) => {
  return (
    // HIGHLIGHT START
    // 2. Replace the static <span> with the navigational <Link> component.
    //    - The 'to' prop defines the destination URL.
    //    - We use a template literal to construct a dynamic path based on the
    //      'category' prop passed to this component.
    //    - The 'className' remains the same, so our existing styles are applied.
    <Link to={`/category/${category}`} className="category-tag">
      {category}
    </Link>
    // HIGHLIGHT END
  );
};

export default CategoryTag;