import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Profile from '../pages/Auth/Profile';
import Dashboard from '../pages/Posts/Dashboard';
import PostForm from '../pages/Posts/PostForm';

// Helper for protected routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex-center min-h-screen">
      <div className="text-primary text-glow">Initializing System...</div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

// Helper for guest-only routes (don't show login if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Protected Section */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/create-post" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
      <Route path="/edit-post/:id" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
