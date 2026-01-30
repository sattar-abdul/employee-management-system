import { connectDB } from "@/lib/db";
import Leave from "@/models/Leave";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, startDate, endDate, reason } = await req.json();
    await connectDB();

    const newLeave = new Leave({
      userId,
      startDate,
      endDate,
      reason,
      status: "pending", // Default Leave request is pending
    });

    await newLeave.save();
    return NextResponse.json({ message: "Leave applied successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to apply leave" }, { status: 500 });
  }
}