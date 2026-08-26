// app/api/admin/signup/route.ts
import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // 1️⃣ Connect to DB
    await connectDB();

    // 2️⃣ Parse request body
    const body = await req.json();
    const { name, email, password, role } = body;

    // 3️⃣ Validate inputs
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    // 4️⃣ Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format." }, { status: 400 });
    }

    // 5️⃣ Password strength check (min 6 chars)
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // 6️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered." }, { status: 409 });
    }

    // 7️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 8️⃣ Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // default role = user
    });

    // 9️⃣ Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in environment variables.");
    }

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 10️⃣ Set HTTP-only cookie
    const response = NextResponse.json(
      { message: "Signup successful", user: { name: newUser.name, email: newUser.email, role: newUser.role } },
      { status: 201 }
    );

    response.cookies.set({
      name: "admin-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
