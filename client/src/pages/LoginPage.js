import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState(null); // 👈 added popup state
  const navigate = useNavigate();

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      localStorage.setItem('bp_token', data.token);
      localStorage.setItem('bp_user', JSON.stringify(data.user));
      window.dispatchEvent(new Event("storage"));

      // 👇 replaced alert with popup
      setPopup({
        title: 'Login Successful!',
        message: `Welcome back, ${data.user.name}!`
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 👇 Close popup handler
  const closePopup = () => {
    setPopup(null);
    navigate('/dashboard'); // Navigate only after closing popup
  };

  return (
    <div className="max-w-md mx-auto bg-white py-8 px-6 rounded-lg shadow relative">
      <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
      <p className="text-gray-500 mb-6">Sign in to access your dashboard.</p>

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={e => update('password', e.target.value)}
              className="mt-1 block w-full border rounded p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-2 top-2 text-gray-500 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-sm text-gray-600 hover:underline"
          >
            Create account
          </button>
        </div>
      </form>

      {/* 👇 Popup Modal */}
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h3 className="text-xl font-semibold mb-2 text-green-600">
              {popup.title}
            </h3>
            <p className="text-gray-700 mb-4">{popup.message}</p>
            <button
              onClick={closePopup}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
