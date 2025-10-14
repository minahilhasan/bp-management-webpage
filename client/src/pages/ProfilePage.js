import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const localUser = localStorage.getItem('bp_user');
    if (localUser) {
      setUser(JSON.parse(localUser));
    } else {
      const token = localStorage.getItem('bp_token');
      if (!token) return;
      fetch('http://localhost:5000/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            localStorage.setItem('bp_user', JSON.stringify(data.user));
          } else {
            localStorage.removeItem('bp_token');
            localStorage.removeItem('bp_user');
            setUser(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('bp_token');
          localStorage.removeItem('bp_user');
        });
    }
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Dashboard</h3>
        <p className="text-gray-600 mb-6">
          Welcome, <span className="font-semibold">{user.name}</span>! Below are your account details.
        </p>

        <div className="border rounded p-4 bg-gray-50 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500">Name</div>
              <div className="font-medium">{user.name}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Email</div>
              <div className="font-medium">{user.email}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Age</div>
              <div className="font-medium">{user.age ?? '—'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Gender</div>
              <div className="font-medium">{user.gender ?? '—'}</div>
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/edit-account')}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            Edit Account Details
          </button>
          <button
            onClick={() => navigate('/change-password')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
