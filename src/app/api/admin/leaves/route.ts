import { connectDB } from "@/lib/db";
import Leave from "@/models/Leave";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { sendLeaveStatusEmail } from "@/lib/mailer";

// GET: Fetch all leave requests for all users
export async function GET() {
  await connectDB();
  const leaves = await Leave.find()
    .populate("userId", "email")
    .sort({ createdAt: -1 });
  return NextResponse.json(leaves);
}

// PATCH: Approve or Reject a leave
export async function PATCH(req: Request) {
  try {
    const { leaveId, status } = await req.json();
    await connectDB();

    const leave = await Leave.findById(leaveId);
    if (!leave)
      return NextResponse.json({ message: "Leave not found" }, { status: 404 });

    // If leave is approved, update the user's 'leavesTaken' count
    if (status === "approved" && leave.status !== "approved") {
      const duration =
        Math.ceil(
          (new Date(leave.endDate).getTime() -
            new Date(leave.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;

      await User.findByIdAndUpdate(leave.userId, {
        $inc: { leavesTaken: duration },
      });
    }

    leave.status = status;
    await leave.save();

    if (leave.status === "approved" || leave.status === "rejected") {
      const user = await User.findById(leave.userId);
      if (user && user.email) {
        await sendLeaveStatusEmail(
          user.email,
          leave.status,
          "Processed by Admin"
        );
      }
    }

    return NextResponse.json({ message: `Leave ${status} successfully` });
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
