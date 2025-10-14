import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'female',
    email: '',
    password: '',
    confirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [popup, setPopup] = useState(null); // 👈 new popup state
  const navigate = useNavigate();

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.email || !form.password) {
      setError('Please fill required fields');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          age: form.age ? Number(form.age) : null,
          gender: form.gender,
          email: form.email,
          password: form.password
        })
      });
      const data = await res.json();
      if (res.ok) {
        // 👇 replaced alert with popup
        setPopup({
          title: 'Account Created!',
          message: `${form.name}'s account has been successfully created.`,
        });

        const fullUser = { ...data.user, ...form };
        localStorage.setItem('bp_token', data.token);
        localStorage.setItem('bp_user', JSON.stringify(fullUser));
        // Dispatch a storage event manually to notify AppRouter
       setTimeout(() => {
        window.dispatchEvent(new Event("storage"));
      }, 100);
      } 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 👇 popup close handler
  const closePopup = () => {
    setPopup(null);
    navigate('/dashboard'); // navigate only after closing popup
  };

  return (
    <div className="max-w-lg mx-auto bg-white py-8 px-6 rounded-lg shadow relative">
      <h2 className="text-2xl font-semibold mb-2">Create your account</h2>
      <p className="text-gray-500 mb-6">
        Sign up so you can manage BP entries and settings.
      </p>

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Full name</label>
          <input
            value={form.name}
            onChange={e => update('name', e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-medium">Age</label>
            <input
              type="number"
              value={form.age}
              onChange={e => update('age', e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium">Gender</label>
            <select
              value={form.gender}
              onChange={e => update('gender', e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            placeholder="your@email.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
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
          <div>
            <label className="text-sm font-medium">Confirm</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirm}
                onChange={e => update('confirm', e.target.value)}
                className="mt-1 block w-full border rounded p-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(p => !p)}
                className="absolute right-2 top-2 text-gray-500 text-sm"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow"
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm text-gray-600 hover:underline"
          >
            Already have an account?
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
