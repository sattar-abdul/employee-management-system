"use client";
import { useEffect, useState } from "react";

export default function AdminLeaves() {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    const res = await fetch("/api/admin/leaves");
    const data = await res.json();
    setLeaves(data);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (leaveId: string, status: string) => {
    const res = await fetch("/api/admin/leaves", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leaveId, status }),
    });
    if (res.ok) fetchLeaves(); // Refresh list
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Leave Requests</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left text-gray-600">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Employee</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l: any) => (
              <tr key={l._id} className="border-t">
                <td className="p-4">{l.userId?.email}</td>
                <td className="p-4 text-sm">
                  {new Date(l.startDate).toDateString()} -{" "}
                  {new Date(l.endDate).toDateString()}
                </td>
                <td className="p-4 text-gray-600">{l.reason}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      l.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : l.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {l.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  {l.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(l._id, "approved")}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(l._id, "rejected")}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
