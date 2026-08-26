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

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

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

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, email, and password are required.",
        },
        { status: 400 }
      );
    }

    // Name validation
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name must be between 2 and 100 characters.",
        },
        { status: 400 }
      );
    }

    // Email validation
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

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters long.",
        },
        { status: 400 }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password cannot exceed 128 characters.",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // CHECK EXISTING USER
    // ========================================================

    const existingUser = await User.findOne({
      email,
    })
      .select("_id")
      .lean();

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is already registered.",
        },
        { status: 409 }
      );
    }

    // ========================================================
    // HASH PASSWORD
    // ========================================================

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // ========================================================
    // CREATE USER
    //
    // IMPORTANT:
    // Role is ALWAYS "user".
    // Client cannot create an admin account.
    // ========================================================

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    // ========================================================
    // JWT
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

    const token = jwt.sign(
      {
        id: newUser._id.toString(),
        role: newUser.role,
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
        message:
          "Account created successfully.",
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );

    // ========================================================
    // HTTP-ONLY AUTH COOKIE
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
      "SIGNUP API ERROR:",
      error
    );

    // MongoDB duplicate key
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email is already registered.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create account. Please try again later.",
      },
      { status: 500 }
    );
  }
}