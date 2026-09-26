# Personal Blog with Markdown Support

> A full-stack MERN Blog Application that allows users to read beautifully formatted Markdown blog posts while providing a secure admin dashboard for managing content.

🌐 **Live Demo:** https://personal-blog-markdown.vercel.app/

📂 **Repository:** https://github.com/Alok567459/personal-blog-markdown

---

## 📖 About the Project

Personal Blog with Markdown Support is a modern blogging platform built using the MERN stack (MongoDB, Express.js, React, and Node.js). It enables administrators to create, edit, and delete blog posts written in Markdown, while visitors can enjoy a clean, responsive reading experience with SEO-friendly URLs.

The project demonstrates full-stack web development concepts including authentication, REST APIs, database integration, deployment, and responsive UI design.

---

## ✨ Features

- 📝 Create, edit, and delete blog posts
- 📄 Markdown rendering with rich formatting
- 🔐 JWT-based Admin Authentication
- 🔑 Secure password hashing using bcrypt
- 🔗 SEO-friendly slug-based URLs
- 📚 Pagination for blog listings
- 🏷️ Categories and Tags support
- 📱 Fully responsive design
- ⚡ RESTful API architecture
- ☁️ Deployed using Vercel and Render

---

## 🛠️ Tech Stack

### Frontend

- React
- React Router
- Axios
- React Markdown
- CSS

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- dotenv

### Database

- MongoDB Atlas
- Mongoose

### Deployment

- Vercel (Frontend)
- Render (Backend)

---

## 📂 Project Structure

```text
personal-blog-markdown/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js (v18 or later)
- npm
- MongoDB Atlas account

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Alok567459/personal-blog-markdown.git
cd personal-blog-markdown
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Create backend environment variables

Create a `.env` file inside the `server` folder.

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

### 4. Start backend server

```bash
npm start
```

---

### 5. Install frontend dependencies

Open another terminal.

```bash
cd client
npm install
```

Create a `.env` file inside `client`.

```env
REACT_APP_API_URL=http://localhost:5001/api
```

Start the frontend.

```bash
npm start
```

The application will run on:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5001`

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/login` | Admin Login |

### Blog Posts

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/posts` | Fetch all posts |
| GET | `/api/posts/:slug` | Fetch single post |
| POST | `/api/posts` | Create new post |
| PUT | `/api/posts/:slug` | Update post |
| DELETE | `/api/posts/:slug` | Delete post |

---

## 🔒 Security Features

- JWT Authentication
- Password hashing using bcryptjs
- Protected admin routes
- Environment variables for sensitive credentials
- CORS configuration

---

## ☁️ Deployment

### Frontend (Vercel)

Environment Variable:

```env
REACT_APP_API_URL=https://your-render-backend.onrender.com/api
```

### Backend (Render)

Environment Variables:

```env
MONGO_URI=your_connection_string
JWT_SECRET=your_secret
FRONTEND_URL=https://personal-blog-markdown.vercel.app
```

---

## 📸 Screenshots

Add screenshots of your application here.

### Home Page

> Add screenshot here

### Blog Post Page

> Add screenshot here

### Admin Dashboard

> Add screenshot here

---

## 🎯 Future Improvements

- 🔍 Search functionality
- 💬 Comment system
- ❤️ Like and Bookmark feature
- 🌙 Dark mode
- ✍️ Rich Text Editor
- 👤 Multi-user authentication
- ⏱️ Reading time estimation
- 📈 Analytics dashboard

---

## 📚 What I Learned

Through this project, I strengthened my understanding of:

- MERN Stack Development
- REST API Design
- JWT Authentication
- MongoDB & Mongoose
- React Routing
- Axios API Integration
- Environment Variable Management
- Full-stack Deployment using Vercel and Render
- Building SEO-friendly web applications

---

## 👨‍💻 Author

**Alok Kumar**

- GitHub: https://github.com/Alok567459

---

## 📄 License

This project is licensed under the MIT License.
