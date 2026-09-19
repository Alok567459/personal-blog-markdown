// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/postModel');

const samplePosts = [
  {
    title: 'Getting Started with Markdown in Modern Web Development',
    author: 'Alok Kumar',
    markdownContent: `# Getting Started with Markdown in Modern Web Development

Markdown is a lightweight markup language created in 2004 by John Gruber with Aaron Swartz. It allows you to write using an easy-to-read, easy-to-write plain text format, which converts into structurally valid HTML.

---

## Why Use Markdown for Your Blog?

1. **Simplicity**: No clunky WYSIWYG editors. You can write in any plain text editor.
2. **Portability**: Your content is stored as plain text, meaning zero lock-in with proprietary formats.
3. **Developer-Friendly**: Supports code blocks with syntax highlighting, lists, blockquotes, and tables seamlessly.

---

## Example Code Snippet

Here is how you can render markdown in React using libraries like \`react-markdown\`:

\`\`\`javascript
import React from 'react';
import ReactMarkdown from 'react-markdown';

function MarkdownRenderer({ content }) {
  return (
    <article className="prose">
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}

export default MarkdownRenderer;
\`\`\`

> *"Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."* — Antoine de Saint-Exupéry

Happy writing!
`,
  },
  {
    title: 'Mastering the Node.js Event Loop and Concurrency',
    author: 'Alok Kumar',
    markdownContent: `# Mastering the Node.js Event Loop and Concurrency

Node.js is single-threaded, yet it handles thousands of concurrent requests efficiently. The secret behind this superpower is the **Event Loop**.

---

## The Phases of the Event Loop

Each iteration ("tick") of the event loop goes through several distinct phases:

1. **Timers**: Executes callbacks scheduled by \`setTimeout()\` and \`setInterval()\`.
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration.
3. **Idle, Prepare**: Used internally by Node.js.
4. **Poll**: Retrieves new I/O events; executes almost all callbacks (excluding close callbacks, timers, and \`setImmediate()\`).
5. **Check**: Executes \`setImmediate()\` callbacks.
6. **Close Callbacks**: Handles socket or handle close events (e.g. \`socket.on('close', ...)\`).

---

## Microtasks vs Macrotasks

Microtasks (\`process.nextTick\` and resolved promises) have priority and are executed immediately after the current operation finishes, before transitioning to the next phase.

\`\`\`javascript
console.log('1. Script start');

setTimeout(() => {
  console.log('4. setTimeout callback');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise callback');
});

process.nextTick(() => {
  console.log('2. nextTick callback');
});
\`\`\`

Understanding this order is fundamental to debugging asynchronous race conditions in Node.js.
`,
  },
  {
    title: 'Building Scalable REST APIs with Express and Mongoose',
    author: 'Alok Kumar',
    markdownContent: `# Building Scalable REST APIs with Express and Mongoose

Creating clean, scalable backend architecture requires separation of concerns, defensive error handling, and structured data validation.

---

## Key Principles for RESTful API Design

- **Resource-Oriented URLs**: Use plural nouns like \`/api/posts\` or \`/api/users\`.
- **Appropriate HTTP Verbs**:
  - \`GET\`: Retrieve resources without side-effects.
  - \`POST\`: Create new resources.
  - \`PUT\` / \`PATCH\`: Update existing resources.
  - \`DELETE\`: Remove resources.
- **Meaningful HTTP Status Codes**: Always return \`200 OK\`, \`201 Created\`, \`400 Bad Request\`, \`404 Not Found\`, or \`500 Internal Server Error\` accordingly.

---

## Example Model Definition

\`\`\`javascript
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  markdownContent: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
\`\`\`

With clear separation between routes, controllers, and models, your project stays maintainable as it grows!
`,
  },
  {
    title: 'Clean Architecture: Why Code Readability Trumps Cleverness',
    author: 'Alok Kumar',
    markdownContent: `# Clean Architecture: Why Code Readability Trumps Cleverness

As software developers, it is tempting to write "clever" one-liners and complex abstractions. However, software is read far more often than it is written.

---

## Principles of Clean Code

1. **Clear Naming Conventions**: Function and variable names should clearly explain what they do.
2. **Single Responsibility**: Each function or module should do one thing and do it well.
3. **Defensive Programming**: Validate inputs, sanitize data, and handle edge cases gracefully.
4. **Self-Documenting Code**: Code should be readable without needing paragraphs of comments explaining *what* it is doing. Comments should explain *why*.

---

## Practical Example

Compare these two functions doing the exact same thing:

\`\`\`javascript
// Clever but obscure
const f = a => a.reduce((x, y) => x + (y.p || 0), 0);

// Clean and readable
function calculateTotalCartPrice(cartItems) {
  return cartItems.reduce((total, item) => total + (item.price || 0), 0);
}
\`\`\`

Your teammates (and future you in six months) will thank you for choosing clarity!
`,
  },
  {
    title: 'The Future of Web Development in 2026 and Beyond',
    author: 'Alok Kumar',
    markdownContent: `# The Future of Web Development in 2026 and Beyond

The web development ecosystem never stops evolving. Here is a look at what is shaping modern engineering practices today:

---

## Key Tech Trends

- **AI-Assisted Pair Programming**: Autonomous coding agents and AI assistants integrated directly into developer workflows.
- **Edge Computing & Serverless**: Running application logic geographically closer to users to reduce latency.
- **Isomorphic TypeScript**: Strict type safety end-to-end, from database schemas to client UI components.
- **Modern Markdown CMS**: Lightweight markdown and MDX powering dynamic documentation and personal blogs.

---

## Looking Ahead

Continuous learning and mastering fundamental engineering concepts remain the greatest superpower for any developer. Keep building and exploring!
`,
  },
];

async function seedDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // Count existing posts
    const existingCount = await Post.countDocuments();
    console.log(`Current post count in database: ${existingCount}`);

    console.log('Inserting sample posts...');
    const createdPosts = await Post.insertMany(samplePosts);
    console.log(`Successfully added ${createdPosts.length} posts!`);

    createdPosts.forEach((post, index) => {
      console.log(`  ${index + 1}. [${post._id}] ${post.title} (by ${post.author})`);
    });

    const totalCount = await Post.countDocuments();
    console.log(`Total posts in database now: ${totalCount}`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedDB();
