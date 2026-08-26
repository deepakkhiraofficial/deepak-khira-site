import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // ========================================================
    // DATABASE
    // ========================================================

    await connectDB();

    // ========================================================
    // REQUEST BODY
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
          message:
            "Email and password are required.",
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
          message:
            "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // JWT SECRET
    // ========================================================

    const JWT_SECRET =
      process.env.JWT_SECRET;

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
    // FIND ADMIN
    //
    // password has select:false in User model,
    // so explicitly include it for authentication.
    // ========================================================

    const admin = await User.findOne({
      email,
      role: "admin",
    }).select("+password");

    // Don't reveal whether the email exists.
    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // ========================================================
    // VERIFY PASSWORD
    // ========================================================

    const passwordValid =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // ========================================================
    // JWT EXPIRATION
    // ========================================================

    const expiresIn =
      process.env.JWT_EXPIRES_IN || "7d";

    // ========================================================
    // CREATE ADMIN JWT
    // ========================================================

    const token = jwt.sign(
      {
        id: admin._id.toString(),
        role: "admin",
      },
      JWT_SECRET,
      {
        expiresIn:
          expiresIn as jwt.SignOptions["expiresIn"],
      }
    );

    // ========================================================
    // RESPONSE
    // ========================================================

    const response = NextResponse.json(
      {
        success: true,
        message:
          "Admin login successful.",
        user: {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 200 }
    );

    // ========================================================
    // HTTP-ONLY ADMIN COOKIE
    // ========================================================

    response.cookies.set({
      name: "admin-token",
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
      "ADMIN LOGIN API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process admin login. Please try again later.",
      },
      { status: 500 }
    );
  }
}