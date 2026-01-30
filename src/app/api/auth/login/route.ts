import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });

    // Checking if user exists and is active
    if (!user || user.status === "inactive") {
      return NextResponse.json(
        { message: "Invalid credentials or account inactive" },
        { status: 401 }
      );
    }

    // Checking password (for now i am using plan text, later will do hashing).
    if (user.password !== password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // set user details
    const response = NextResponse.json({
      role: user.role,
      email: user.email,
      id: user._id,
      leaveQuota: user.leaveQuota,
      leavesTaken: user.leavesTaken,
    });

    // Set a cookie for the Middleware
    response.cookies.set("userRole", user.role, {
      httpOnly: true, // Security: prevents JS from reading the cookie
      maxAge: 60 * 60 * 24, // Cookie expires in 1 day
    });

    // Return the role for redirection
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
