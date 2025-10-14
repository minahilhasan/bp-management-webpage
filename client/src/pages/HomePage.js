import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🧠 Log out only when user actually visits `/` (not during navigation away)
  useEffect(() => {
    if (location.pathname === "/") {
      localStorage.removeItem("bp_token");
      localStorage.removeItem("bp_user");
      console.log("User logged out automatically on homepage visit.");
    }
  }, [location.pathname]);

  return (
    <AnimatePresence>
      <motion.div
        key="homepage"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200 text-gray-800"
      >
        {/* Hero Section */}
        <div className="flex flex-col justify-center items-center flex-grow text-center px-6 py-20">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-extrabold mb-4 text-blue-700 drop-shadow-md"
          >
            Welcome to <span className="text-blue-500">BP Portal</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg max-w-2xl mb-8 text-gray-600"
          >
            Manage your account, update details, and track your progress effortlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex gap-4"
          >
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-white hover:bg-gray-100 text-blue-700 border border-blue-500 px-6 py-3 rounded-xl font-semibold shadow-md transition-all"
            >
              Login
            </button>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="bg-blue-700 text-white py-4 text-center text-sm">
          © {new Date().getFullYear()} BP Portal — All Rights Reserved
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}
