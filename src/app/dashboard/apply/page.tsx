"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyLeave() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await fetch("/api/leaves/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        startDate,
        endDate,
        reason,
      }),
    });

    if (res.ok) {
      alert("Application Submitted!");
      router.push("/dashboard");
    } else {
      alert("Error submitting request.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Apply for Leave
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                required
                className="w-full border p-2 rounded mt-1"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                required
                className="w-full border p-2 rounded mt-1"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              required
              rows={4}
              className="text-gray-700 w-full border p-2 rounded mt-1"
              placeholder="Briefly explain your reason..."
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 border rounded hover:bg-gray-50 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
