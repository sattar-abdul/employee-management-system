"use client";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Status messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Could not load user list.");
    }
  };

  useEffect(() => {
    // 1. Safe access to localStorage after mount
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUser(storedUser);

    // 2. Fetch users
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("User created successfully!");
        setEmail("");
        setPassword("");
        fetchUsers(); // Refresh list
      } else {
        // Show the specific error message from the API
        setError(data.message || "Failed to create user");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const handleUpdateUser = async (id: string, updateData: object) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        setSuccess("User updated!");
        fetchUsers(); // Refresh the list
      } else {
        setError("Failed to update user.");
      }
    } catch (err) {
      setError("Network error.");
    }
  };

  const handleUpdateQuota = async (userId: string, newQuota: string) => {
    // Get current logged in user to check their role
    const loggedInUser = currentUser;

    try {
      const res = await fetch("/api/admin/leaves/quota", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          newQuota: Number(newQuota),
          adminRole: loggedInUser.role, // Sending role to verify on backend
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Quota updated successfully!");
        fetchUsers(); // Refresh the list to show new data
      } else {
        setError(data.message || "Failed to update quota");
      }
    } catch (err) {
      setError("Network error updating quota.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mr-8 text-gray-800">
          Admin Panel {currentUser.role === "superadmin" ? "(super admin)" : ""}
        </h1>
        {/* Logout button */}
        <LogoutButton />
      </div>

      {/* FEEDBACK MESSAGES (error/success) */}
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 text-green-700 bg-green-100 border-l-4 border-green-500 rounded">
          {success}
        </div>
      )}

      {/* ADD USER FORM */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-600">
          Add New Employee
        </h2>
        <form
          onSubmit={handleAddUser}
          className="flex flex-wrap gap-4 items-end"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-black mt-1 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="employee@company.com"
              required
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black mt-1 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div className="w-40">
            <label className="block text-sm font-medium text-gray-600">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="text-black mt-1 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option className="text-black" value="user">
                User
              </option>
              <option className="text-black" value="admin">
                Admin
              </option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Add User
          </button>
        </form>
      </div>

      {/*Active USER LIST */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-lg font-semibold mb-4 text-gray-600 p-4">
        List of Active users
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Role</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">
                Max Allowed Leave
              </th>
              <th className="p-4 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(
                (u: any) =>
                  u.status === "active" && (
                    <tr key={u._id} className="border-t hover:bg-gray-50">
                      <td className="p-4 text-gray-800">{u.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded ${
                            u.role === "admin" || u.role === "superadmin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>

                      <td className={`p-4 text-green-700`}>{u.status}</td>

                      <td className="p-4">
                        {/* Check if the user viewing the page is a Super Admin */}
                        {JSON.parse(localStorage.getItem("user") || "{}")
                          .role === "superadmin" ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              className="border border-gray-300 w-20 p-1 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                              defaultValue={u.leaveQuota}
                              onBlur={(e) =>
                                handleUpdateQuota(u._id, e.target.value)
                              }
                            />
                            <span className="text-gray-500 text-sm">days</span>
                          </div>
                        ) : (
                          <span className="text-gray-700 font-medium">
                            {u.leaveQuota} days
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          {/* Soft Delete Button */}
                          {u.role !== "superadmin" && (
                            <button
                              onClick={() =>
                                handleUpdateUser(u._id, { status: "inactive" })
                              }
                              className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                            >
                              Soft delete
                            </button>
                          )}

                          {/* Change Role Button (Only visible to superadmin */}
                          {currentUser.role == "superadmin" &&
                            u.role === "user" && (
                              <button
                                onClick={() =>
                                  handleUpdateUser(u._id, { role: "admin" })
                                }
                                className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                              >
                                Make Admin
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  )
              )
            ) : (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No active users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*Inactive USER LIST */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-lg font-semibold mb-4 mt-8 text-red-600 p-4">
        List of Inactive users
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Role</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">
                Max Allowed Leave
              </th>
              <th className="p-4 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(
                (u: any) =>
                  u.status === "inactive" && (
                    <tr key={u._id} className="border-t hover:bg-gray-50">
                      <td className="p-4 text-gray-800">{u.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded ${
                            u.role === "admin" || u.role === "superadmin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>

                      <td className={`p-4 text-red-800`}>{u.status}</td>

                      <td className="p-4">
                        {/* Check if the user viewing the page is a Super Admin */}
                        {JSON.parse(localStorage.getItem("user") || "{}")
                          .role === "superadmin" ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              className="border border-gray-300 w-20 p-1 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                              defaultValue={u.leaveQuota}
                              onBlur={(e) =>
                                handleUpdateQuota(u._id, e.target.value)
                              }
                            />
                            <span className="text-gray-500 text-sm">days</span>
                          </div>
                        ) : (
                          <span className="text-gray-700 font-medium">
                            {u.leaveQuota} days
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          {/* Soft Delete Button */}
                          {u.role !== "superadmin" && (
                            <button
                              onClick={() =>
                                handleUpdateUser(u._id, { status: "active" })
                              }
                              className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200"
                            >
                              Re-Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
              )
            ) : (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No Inactive users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
