import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

// GET: Fetch all users
export async function GET() {
  await connectDB();
  const users = await User.find({});
  return NextResponse.json(users);
}

// POST: Create a new user
export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const newUser = new User({ email, password, role });
    await newUser.save();

    return NextResponse.json({ message: "User created successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
}


