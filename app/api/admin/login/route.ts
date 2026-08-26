import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ============================================================
// ADMIN LOGIN API
// ============================================================

export async function POST(req: Request) {
  try {
    // ==========================================================
    // 1. CHECK JWT CONFIGURATION
    // ==========================================================

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error("ADMIN LOGIN: JWT_SECRET is missing.");

      return NextResponse.json(
        {
          success: false,
          message: "Authentication service is not configured.",
        },
        { status: 500 }
      );
    }

    // ==========================================================
    // 2. CONNECT DATABASE
    // ==========================================================

    await connectDB();

    // ==========================================================
    // 3. READ REQUEST BODY
    // ==========================================================

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    // ==========================================================
    // 4. SAFE BODY EXTRACTION
    // ==========================================================

    const requestBody =
      typeof body === "object" &&
      body !== null
        ? body as Record<string, unknown>
        : {};

    const email =
      typeof requestBody.email === "string"
        ? requestBody.email.trim().toLowerCase()
        : "";

    const password =
      typeof requestBody.password === "string"
        ? requestBody.password
        : "";

    // ==========================================================
    // 5. VALIDATE EMAIL
    // ==========================================================

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
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

    // ==========================================================
    // 6. VALIDATE PASSWORD
    // ==========================================================

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // ==========================================================
    // 7. FIND ADMIN USER
    //
    // password is assumed to be select:false in User model.
    // Therefore explicitly select it for authentication.
    // ==========================================================

    const admin = await User.findOne({
      email,
      role: "admin",
    }).select("+password");

    // ==========================================================
    // 8. GENERIC AUTHENTICATION ERROR
    // ==========================================================

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // ==========================================================
    // 9. CHECK STORED PASSWORD
    // ==========================================================

    if (
      typeof admin.password !== "string" ||
      !admin.password
    ) {
      console.error(
        "ADMIN LOGIN: Admin account has no valid password hash."
      );

      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const passwordValid =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // ==========================================================
    // 10. JWT EXPIRATION
    // ==========================================================

    const expiresIn =
      process.env.JWT_EXPIRES_IN || "7d";

    // ==========================================================
    // 11. CREATE ADMIN JWT
    // ==========================================================

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

    // ==========================================================
    // 12. CREATE RESPONSE
    // ==========================================================

    const response = NextResponse.json(
      {
        success: true,
        message: "Admin login successful.",
        user: {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 200 }
    );

    // ==========================================================
    // 13. SET HTTP-ONLY ADMIN COOKIE
    // ==========================================================

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

    // ==========================================================
    // 14. RETURN SUCCESS
    // ==========================================================

    return response;
  } catch (error: unknown) {
    console.error(
      "ADMIN LOGIN API ERROR:",
      error instanceof Error
        ? error.message
        : error
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