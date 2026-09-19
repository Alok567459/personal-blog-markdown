// client/src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// HIGHLIGHT START
// 1. Import the page components we created in the previous step.
// The './pages/HomePage' path tells React to look for HomePage.js
// inside the 'pages' directory, which is in the same 'src' directory as App.js.
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
// We'll also import the AdminDashboard to prepare for future steps.
import AdminDashboard from './pages/AdminDashboard'; 
// HIGHLIGHT END

function App() {
  return (
    <BrowserRouter>
      <div className="App">

         {/* 2. Render the Navbar component here. It will now appear on every page. */}
        <Navbar />

        <main style={{ padding: '1rem' }}>
        <Routes>
          {/* HIGHLIGHT START */}
          {/*
            Each 'element' prop now receives a JSX component instance instead of placeholder text.
            When the path matches, React Router will render the specified component.
          */}
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          
          {/* This route will be protected later, but we can define it now. */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* HIGHLIGHT END */}
        </Routes>
         </main>
      </div>
    </BrowserRouter>
  );
}

export default App;