import { connectDB } from "@/lib/db";
import Leave from "@/models/Leave";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const today = new Date();
  
  // Find approved leaves where the end date hasn't passed yet
  const leaves = await Leave.find({
    status: "approved",
    endDate: { $gte: today }
  }).populate('userId', 'email'); // Get user email along with the leave

  return NextResponse.json(leaves);
}