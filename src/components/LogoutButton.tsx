"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Call the API to clear the cookie
    await fetch("/api/auth/logout", { method: "POST" });

    // 2. Clear LocalStorage
    localStorage.removeItem("user");

    // 3. Redirect to home page
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition-colors font-medium border border-red-200"
    >
      Sign Out
    </button>
  );
}
