import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('bp_user');
    return u ? JSON.parse(u) : null;
  });
  const navigate = useNavigate();
  const location = useLocation();
    useEffect(() => {
  // Auto logout if user navigates to homepage
  if (location.pathname === "/") {
    if (localStorage.getItem("bp_token")) {
      localStorage.removeItem("bp_token");
      localStorage.removeItem("bp_user");
      setUser(null);
      alert("You have been logged out.");
      console.log("✅ Automatically logged out on homepage visit");
    }
  }
}, [location.pathname]);

  useEffect(() => {
    const handleStorageChange = () => {
      const u = localStorage.getItem('bp_user');
      setUser(u ? JSON.parse(u) : null);
    };
    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem('bp_token');
    localStorage.removeItem('bp_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 focus:outline-none"
        >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold">
            BP
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800">BP Management</div>
            <div className="text-xs text-gray-500">Track your health easily</div>
          </div>
        </button>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-sm text-gray-700">
                Hi, <span className="font-medium">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-50 text-red-600 rounded-md border border-red-100 text-sm hover:bg-red-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1 rounded-md hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

