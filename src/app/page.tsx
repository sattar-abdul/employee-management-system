"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 p-6 text-center">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Employee <span className="text-blue-600">Portal</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Manage your leaves, view your team, and stay updated with your
          department&apos;s schedule—all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
          >
            Go to Login
          </Link>
        </div>
      </div>

      <footer className="mt-16 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Employee management system. All rights
        reserved.
      </footer>
    </div>
  );
}
