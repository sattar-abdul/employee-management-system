"use client";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [team, setTeam] = useState([]);
  const [upcomingLeaves, setUpcomingLeaves] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // 1. fetch team list
    const teamRes = await fetch("/api/admin/users");
    const teamData = await teamRes.json();
    setTeam(teamData);

    // 2. fetch upcoming  leaves
    const leaveRes = await fetch("/api/leaves/upcoming");
    const leaveData = await leaveRes.json();
    setUpcomingLeaves(leaveData);
  };

  if (!user) return <p className="p-8">Loading</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Employee Dashboard</h1>
        {/* Logout button */}
        <LogoutButton />
      </div>

      <div className="bg-blue-600 text-white px-4 py-2 mb-2 rounded-lg shadow">
          Quota:{" "}
          <span className="font-bold">
            {user.leaveQuota - user.leavesTaken} days remaining
          </span>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* UPCOMING LEAVES SECTION */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">
            Upcoming Leaves (Team)
          </h2>
          <ul className="space-y-3">
            {upcomingLeaves.map((leave: any) => (
              <li
                key={leave._id}
                className="flex justify-between items-center p-3 bg-blue-50 rounded-lg text-gray-600"
              >
                <span className="font-medium">{leave.userId.email}</span>
                <span className="text-sm">
                  {new Date(leave.startDate).toLocaleDateString()} to{" "}
                  {new Date(leave.endDate).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* MY TEAM SECTION */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
            My Team
          </h2>
          <div className="divide-y">
            {team.map((member: any) => (
              <div
                key={member._id}
                className="py-3 flex items-center justify-between"
              >
                <span className="text-gray-800">{member.email}</span>
                <span
                  className={`px-2 py-1 text-xs font-bold rounded ${
                    member.role === "admin" || member.role === "superadmin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {member.role.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button
        onClick={() => (window.location.href = "/dashboard/apply")}
        className="fixed bottom-10 right-10 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 font-bold"
      >
        + Apply Leave
      </button>
    </div>
  );
}
