import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // ========================================================
    // DATABASE
    // ========================================================

    await connectDB();

    // ========================================================
    // REQUEST
    // ========================================================

    const body = await req.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    // ========================================================
    // VALIDATION
    // ========================================================

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // FIND USER
    //
    // IMPORTANT:
    // This route is for normal users.
    // Admin login is handled separately by:
    // /api/admin/login
    // ========================================================

    const user = await User.findOne({
      email,
      role: "user",
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // ========================================================
    // PASSWORD
    // ========================================================

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // ========================================================
    // JWT SECRET
    // ========================================================

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error(
        "JWT_SECRET is not configured."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Authentication service is not configured.",
        },
        { status: 500 }
      );
    }

    // ========================================================
    // CREATE USER TOKEN
    // ========================================================

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: "user",
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ========================================================
    // RESPONSE
    // ========================================================

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // ========================================================
    // USER HTTP-ONLY COOKIE
    // ========================================================

    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error(
      "USER LOGIN API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process login. Please try again later.",
      },
      { status: 500 }
    );
  }
}