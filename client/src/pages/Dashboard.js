import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse, Activity, FileText, User, Pill, Bell } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [latestBP, setLatestBP] = useState(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [reminders, setReminders] = useState([]);
  const token = localStorage.getItem("bp_token");
  const user = JSON.parse(localStorage.getItem("bp_user"));

  // 🩺 Motivational health quotes
  const quotes = [
    "Take care of your body — it's the only place you have to live.",
    "A calm mind keeps your blood pressure normal.",
    "Small steps every day lead to a healthier heart.",
    "Healthy habits today, stronger heart tomorrow.",
    "You can’t control everything, but you can control your health.",
    "Rest, hydrate, and breathe — your heart deserves peace.",
    "Every BP check is a step towards better health awareness.",
    "Discipline beats motivation when it comes to health.",
  ];

  // 🕒 Auto change quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  // 🧠 Fetch reminders (ensure correct API path)
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/reminder/${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch reminders");
        const data = await res.json();
        setReminders(data || []);
      } catch (err) {
        console.error("Reminder fetch error:", err);
      }
    };
    if (user?.id) fetchReminders();
  }, [user?.id]);

  // 🩸 Fetch latest BP
  useEffect(() => {
    const fetchLatestBP = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bp/latest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return console.error("Failed to fetch BP data");
        const data = await response.json();
        setLatestBP(data || null);
      } catch (error) {
        console.error("Error fetching latest BP:", error);
      }
    };
    if (token) fetchLatestBP();
  }, [token]);

  // 💡 Helper functions
  const getStatus = (systolic, diastolic) => {
    if (systolic > 130 || diastolic > 90) return "High";
    if (systolic < 110 || diastolic < 70) return "Low";
    return "Normal";
  };

  const getGradient = (status) => {
    switch (status) {
      case "High":
        return "from-red-500 to-red-700";
      case "Low":
        return "from-yellow-400 to-amber-600";
      default:
        return "from-green-400 to-emerald-600";
    }
  };

  const status = latestBP ? getStatus(latestBP.systolic, latestBP.diastolic) : null;

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-6">
      {/* 🧘 Motivational Quote Slider */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center p-4 rounded-2xl shadow-md relative overflow-hidden">
        <div
          key={quoteIndex}
          className="text-lg font-medium transition-all duration-700 ease-in-out animate-fade-in"
        >
          “{quotes[quoteIndex]}”
        </div>
      </div>

      {/* 🩺 Main Dashboard */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Here’s your blood pressure overview and quick actions.
        </p>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
            <button
              onClick={() => navigate("/record-bp")}
              className="p-6 bg-gradient-to-r from-green-400 to-emerald-600 text-white rounded-xl shadow-lg hover:opacity-90 transition flex flex-col items-center justify-center space-y-2"
            >
              <HeartPulse size={32} />
              <span className="text-lg font-semibold">Record BP</span>
            </button>

            <button
              onClick={() => navigate("/bp-records")}
              className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:opacity-90 transition flex flex-col items-center justify-center space-y-2"
            >
              <FileText size={32} />
              <span className="text-lg font-semibold">BP Records</span>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl shadow-lg hover:opacity-90 transition flex flex-col items-center justify-center space-y-2"
            >
              <User size={32} />
              <span className="text-lg font-semibold">My Profile</span>
            </button>

            <button
              onClick={() => navigate("/set-reminder")}
              className="p-6 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl shadow-lg hover:opacity-90 transition flex flex-col items-center justify-center space-y-2"
            >
              <Pill size={32} />
              <span className="text-lg font-semibold">Set Medicine Reminder</span>
            </button>
          </div>

          {/* Right section: Latest BP */}
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-inner flex flex-col items-center justify-center text-center relative overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Activity className="text-indigo-500" /> Latest BP Reading
            </h2>

            {latestBP ? (
              <div
                className={`p-6 rounded-2xl text-white shadow-md bg-gradient-to-r ${getGradient(
                  status
                )} animate-pulse-soft`}
              >
                <div className="text-5xl font-extrabold mb-2">
                  {latestBP.systolic}/{latestBP.diastolic}
                </div>
                <div className="text-lg font-semibold tracking-wide">
                  {status} BP
                </div>
                <p className="text-sm text-white/80 mt-2">
                  Recorded on {new Date(latestBP.created_at).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-lg font-medium">
                BP not measured yet
              </p>
            )}
          </div>
        </div>

       {/* 🕒 Medicine Reminders Section */}
<div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 md:col-span-2 mt-8">
  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
    <Bell className="text-pink-500" /> Medicine Reminders
  </h2>

  <div className="space-y-3">
    {reminders.length > 0 ? (
      reminders.map((rem) => (
        <div
          key={rem.id}
          className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition"
        >
          <div>
            <p className="font-semibold text-gray-700">{rem.medicine_name}</p>
            <p className="text-sm text-gray-500">
              {new Date(rem.reminder_time).toLocaleString()}
            </p>

            {/* ✅ Only show badge if repeat_daily is truthy (1 or true) */}
            {(rem.repeat_daily === 1 || rem.repeat_daily === true) && (
              <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded-full mt-1 inline-block">
                🔁 Repeats Daily
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* 📅 Status badge */}
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                rem.sent
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {rem.sent ? "Sent" : "Upcoming"}
            </span>

            {/* ✏️ Edit */}
            <button
              onClick={() =>
                navigate("/set-reminder", { state: { editReminder: rem } })
              }
              className="text-blue-500 hover:text-blue-700 transition"
              title="Edit reminder"
            >
              ✏️
            </button>

            {/* 🗑️ Delete */}
            <button
              onClick={async () => {
                await fetch(`http://localhost:5000/api/reminder/${rem.id}`, {
                  method: "DELETE",
                });
                setReminders((prev) => prev.filter((r) => r.id !== rem.id));
              }}
              className="text-red-500 hover:text-red-700 transition"
              title="Delete reminder"
            >
              🗑️
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No reminders set yet.</p>
    )}
  </div>
</div>


      </div>
    </div>
  );
}
