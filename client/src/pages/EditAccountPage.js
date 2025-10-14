import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditAccountPage() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('bp_user'));
  const token = localStorage.getItem('bp_token');

  const [form, setForm] = useState({
    name: storedUser?.name || '',
    age: storedUser?.age || '',
    gender: storedUser?.gender || '',
    email: storedUser?.email || ''
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
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to update profile');

      if (data.user) {
        localStorage.setItem('bp_user', JSON.stringify(data.user));
        alert(`${data.user.name}'s profile updated successfully!`);
        navigate('/dashboard');
      } else {
        alert('Profile updated, but missing user data from server.');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating profile');
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
          Edit Account Details
        </h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 border rounded-lg"
        />
        <input
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
          className="w-full p-2 border rounded-lg"
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full p-2 border rounded-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white p-2 rounded-lg transition`}
        >
          {loading ? 'Saving...' : 'Save Changes'}
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
