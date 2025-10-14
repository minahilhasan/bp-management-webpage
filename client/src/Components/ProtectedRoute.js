import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('bp_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // optionally, you could call /api/me to validate token. For now, assume token presence is enough for UX.
  return children;
}
