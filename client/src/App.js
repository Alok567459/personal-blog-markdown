// client/src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Pages
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import Signup from './pages/Signup';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import CategoryPage from './pages/CategoryPage';
import UserDashboard from './pages/UserDashboard';
import UserCreatePost from './pages/UserCreatePost';
import UserEditPost from './pages/UserEditPost';

// Import Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />

          {/* Login — accessible at both /login and /admin/login */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Signup — public route for new users */}
          <Route path="/signup" element={<Signup />} />

          {/* --- Protected User Routes (any authenticated user) --- */}
          <Route
            path="/dashboard"
            element={
              <UserProtectedRoute>
                <UserDashboard />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/create-post"
            element={
              <UserProtectedRoute>
                <UserCreatePost />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/edit-post/:id"
            element={
              <UserProtectedRoute>
                <UserEditPost />
              </UserProtectedRoute>
            }
          />

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
          <Route
            path="/admin/edit-post/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
