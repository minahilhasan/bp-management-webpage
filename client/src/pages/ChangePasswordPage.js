import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('bp_token');
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      alert('All fields are required');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert('Password changed successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Change Password
        </h2>

        <input
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          placeholder="Current Password"
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="New Password"
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm New Password"
          className="w-full p-2 border rounded-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white p-2 rounded-lg transition`}
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="w-full bg-gray-400 text-white p-2 rounded-lg hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
