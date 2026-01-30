"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        // storing basic user info in localStorage for simple session management
        localStorage.setItem("user", JSON.stringify(data));

        // redirect logic
        if (data.role === "superadmin" || data.role === "admin") {
          router.push("/admin"); // both goes to admin panel
        } else {
          router.push("/dashboard"); // regular user
        }
      } else {
        setError(data.message || "Login Failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
        <p className="text-l text-center text-gray-800">
          Please Login to access the system
        </p>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
