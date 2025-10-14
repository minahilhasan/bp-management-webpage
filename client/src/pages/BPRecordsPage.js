import React, { useEffect, useState } from "react";

export default function BPRecordsPage() {
  const [records, setRecords] = useState([]);
  const token = localStorage.getItem("bp_token");

  useEffect(() => {
    const fetchRecords = async () => {
      const res = await fetch("http://localhost:5000/api/bp/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setRecords(data);
    };
    fetchRecords();
  }, [token]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">BP Records</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Systolic</th>
              <th className="py-2 px-4 text-left">Diastolic</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length ? (
              records.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 px-4">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">{r.systolic}</td>
                  <td className="py-2 px-4">{r.diastolic}</td>
                  <td
                    className={`py-2 px-4 font-semibold ${
                      r.status === "High"
                        ? "text-red-600"
                        : r.status === "Low"
                        ? "text-yellow-500"
                        : "text-green-600"
                    }`}
                  >
                    {r.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
