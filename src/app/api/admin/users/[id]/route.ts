import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await for id here
    const { role, status } = await req.json();

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        ...(role && { role }),
        ...(status && { status }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
