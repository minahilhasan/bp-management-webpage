// src/Components/UserNavbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react'; // ✅ added User icon

export default function UserNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("bp_user");
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("bp_user");
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("bp_token");
    localStorage.removeItem("bp_user");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and title */}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold">
            BP
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800">BP Management</div>
            <div className="text-xs text-gray-500">Track your health easily</div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          <Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
          <Link to="/profile" className="hover:text-indigo-600">My Profile</Link>
          <Link to="/record-bp" className="hover:text-indigo-600">Record BP</Link>
          <Link to="/bp-records" className="hover:text-indigo-600">BP Records</Link>

          {/* ✅ Show user name */}
          {user && (
            <div className="flex items-center gap-2 text-gray-600">
              <User size={18} />
              <span className="font-medium">Hi, {user.name}</span>
            </div>
          )}

          <button
            onClick={logout}
            className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-md hover:bg-red-100 transition text-sm"
          >
            Logout
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 flex flex-col text-gray-700 px-4 py-3 space-y-2">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/profile" onClick={() => setMenuOpen(false)}>My Profile</Link>
          <Link to="/record-bp" onClick={() => setMenuOpen(false)}>Record BP</Link>
          <Link to="/bp-records" onClick={() => setMenuOpen(false)}>BP Records</Link>

          {/* ✅ Show user name on mobile */}
          {user && (
            <div className="flex items-center gap-2 text-gray-600 pt-2">
              <User size={18} />
              <span className="font-medium">{user.name}</span>
            </div>
          )}

          <button
            onClick={() => {
              setMenuOpen(false);
              logout();
            }}
            className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-md hover:bg-red-100 transition text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
