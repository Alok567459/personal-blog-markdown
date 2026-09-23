// client/src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Pages
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import CreatePost from './pages/CreatePost';
// HIGHLIGHT START
import EditPost from './pages/EditPost'; // 1. Import the new EditPost page
// HIGHLIGHT END

// Import Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/admin/login" element={<LoginPage />} />

          {/* --- Protected Admin Routes --- */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-post"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          {/* HIGHLIGHT START */}
          {/* 2. Add the dynamic route for editing a post.
               The ':id' part is a URL parameter that React Router will capture.
               This route is also protected, as it should be. */}
          <Route
            path="/admin/edit-post/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />
          {/* HIGHLIGHT END */}
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;