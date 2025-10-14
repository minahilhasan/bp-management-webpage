import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecordBPPage() {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [popup, setPopup] = useState(null);
  const token = localStorage.getItem("bp_token");
  const navigate = useNavigate();

  // Function to determine BP status
  const getStatus = (s, d) => {
    if ((s > 130 && s <= 140) || (d > 90 && d < 100)) return "High";
    if ((s < 110 && s >= 100) || (d < 70 && d > 60)) return "Low";
    if (s > 140|| d > 100) return "Extremely-High";
    if (s < 100 || d < 60) return "Extremely-Low";
    return "Normal";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!systolic || !diastolic) {
      setPopup({ message: "Please enter both values!", type: "warning" });
      setTimeout(() => setPopup(null), 2500);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/bp/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ systolic, diastolic }),
      });

      const data = await res.json();

      if (res.ok) {
        const status = getStatus(Number(systolic), Number(diastolic));
        let message = "";

        if (status === "High") message = "⚠️ Warning: Your BP is High!";
        else if (status === "Low") message = "⚠️ Caution: Your BP is Low!";
        else if(status === "Extremely-High") message = "⚠️ Warning: Your BP is very high! It is recommended to visit a doctor.";
        else if(status === "Extremely-Low") message = "⚠️ Warning: Your BP is very low! It is recommended to visit a doctor.";
        else message = "✅ Your BP is Normal!";

        // Show popup
        setPopup({ message, type: status.toLowerCase() });

        // Auto-hide popup and navigate
        setTimeout(() => {
          setPopup(null);
          navigate("/dashboard");
        }, 2500);
      } else {
        setPopup({ message: data.message || "Error saving data", type: "error" });
        setTimeout(() => setPopup(null), 2500);
      }
    } catch (err) {
      setPopup({ message: "Network error", type: "error" });
      setTimeout(() => setPopup(null), 2500);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 relative">
      {/* Popup Message */}
      {popup && (
        <div
          className={`absolute top-32 z-50 px-6 py-3 rounded-xl text-white font-medium shadow-lg transform transition-all duration-300 ${
            popup.type === "high" 
              ? "bg-red-600"
              : popup.type === "extremely-high"
              ? "bg-red-600"
              : popup.type === "low"
              ? "bg-yellow-500"
              : popup.type === "extremely-low"
              ? "bg-yellow-500"
              : popup.type === "normal"
              ? "bg-green-600"
              : "bg-gray-600"
          } animate-bounce`}
        >
          {popup.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Record Blood Pressure
        </h2>
        <input
          type="number"
          placeholder="Systolic (Top)"
          value={systolic}
          onChange={(e) => setSystolic(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="number"
          placeholder="Diastolic (Bottom)"
          value={diastolic}
          onChange={(e) => setDiastolic(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Save Reading
        </button>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="w-full bg-gray-400 text-white p-2 rounded-lg hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
