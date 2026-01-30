import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const { userId, newQuota, adminRole } = await req.json();

    // Admins should NOT have the option to increase leave quota
    if (adminRole !== 'superadmin') {
      return NextResponse.json({ message: "Access denied. Only Super Admin can change quota." }, { status: 403 });
    }

    await connectDB();
    await User.findByIdAndUpdate(userId, { leaveQuota: newQuota });

    return NextResponse.json({ message: "Quota updated successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}