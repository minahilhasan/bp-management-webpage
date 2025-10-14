import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function SetReminder() {
  const navigate = useNavigate();
  const location = useLocation();
  const editReminder = location.state?.editReminder || null;

  const user = JSON.parse(localStorage.getItem("bp_user"));

  const [medicineName, setMedicineName] = useState(editReminder?.medicine_name || "");
  const [reminderTime, setReminderTime] = useState(editReminder?.reminder_time?.slice(0, 16) || "");
  const [repeatDaily, setRepeatDaily] = useState(editReminder?.repeat_daily === 1);
  const [popup, setPopup] = useState(null); // 👈 popup modal

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!medicineName || !reminderTime) {
      return setPopup({ title: "Error", message: "Please fill in all fields." });
    }

    try {
      if (editReminder) {
        // ✏️ Edit existing reminder
        const res = await fetch(`http://localhost:5000/api/reminder/update/${editReminder.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            medicine_name: medicineName,
            reminder_time: reminderTime,
            repeat_daily: repeatDaily,
          }),
        });

        if (res.ok) {
          setPopup({ title: "Success", message: "Reminder updated successfully!" });
        } else {
          setPopup({ title: "Error", message: "Failed to update reminder." });
        }
      } else {
        // ➕ Create new reminder
        const res = await fetch("http://localhost:5000/api/reminder/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            email: user.email,
            medicine_name: medicineName,
            reminder_time: reminderTime,
            repeat_daily: repeatDaily,
          }),
        });

        if (res.ok) {
          setPopup({ title: "Success", message: "Reminder set successfully!" });
        } else {
          setPopup({ title: "Error", message: "Failed to set reminder." });
        }
      }
    } catch (error) {
      console.error("Error setting reminder:", error);
      setPopup({ title: "Error", message: "An error occurred while saving reminder." });
    }
  };

  const closePopup = () => {
    setPopup(null);
    if (popup?.title === "Success") {
      navigate("/dashboard");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-lg rounded-2xl border border-gray-200 relative">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
        {editReminder ? "Edit Medicine Reminder" : "Set Medicine Reminder"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Medicine Name</label>
          <input
            type="text"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter medicine name"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Reminder Time</label>
          <input
            type="datetime-local"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={repeatDaily}
            onChange={() => setRepeatDaily(!repeatDaily)}
            className="w-5 h-5 accent-indigo-600"
          />
          <label className="text-gray-700 font-medium">Repeat daily</label>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          {editReminder ? "Update Reminder" : "Set Reminder"}
        </button>
      </form>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-indigo-600 hover:underline text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* 👇 Popup Modal */}
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h3
              className={`text-xl font-semibold mb-2 ${
                popup.title === "Success" ? "text-green-600" : "text-red-600"
              }`}
            >
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
