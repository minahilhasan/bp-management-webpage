import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import EditAccountPage from "./pages/EditAccountPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ProfilePage from './pages/ProfilePage';
import BPRecordsPage from "./pages/BPRecordsPage";
import RecordBPPage from "./pages/RecordBPPage";
import SetReminderPage from "./pages/SetReminderPage";
import UserNavbar from "./Components/UserNavbar";
import Navbar from './Components/Navbar';
import ProtectedRoute from './Components/ProtectedRoute';

export default function AppRouter() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("bp_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    // Listen for changes to localStorage (login/logout from other tabs or app actions)
    const handleStorageChange = () => {
      const stored = localStorage.getItem("bp_user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check manually on mount
    handleStorageChange();

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        {user ? <UserNavbar /> : <Navbar />}
        <main className="flex-grow container mx-auto px-4 py-8">
 <Routes>
  {/* Homepage (default start page) */}
  <Route path="/" element={<HomePage />} />

  {/* Public routes */}
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/login" element={<LoginPage />} />

  {/* Protected routes */}

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/edit-account"
    element={
      <ProtectedRoute>
        <EditAccountPage />
      </ProtectedRoute>
    }
  />
  <Route
    path="/change-password"
    element={
      <ProtectedRoute>
        <ChangePasswordPage />
      </ProtectedRoute>
    }
  />

   <Route path="/profile" element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
    } />
  <Route path="/record-bp" element={
    <ProtectedRoute>
      <RecordBPPage />
    </ProtectedRoute>
    } />
  <Route path="/bp-records" element={
    <ProtectedRoute>
      <BPRecordsPage />
    </ProtectedRoute>
    } />
  <Route
  path="/set-reminder"
  element={
    <ProtectedRoute>
      <SetReminderPage />
    </ProtectedRoute>
  }
/>
  {/* Optional fallback */}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>


        </main>
      </div>
    </BrowserRouter>
  );
}
