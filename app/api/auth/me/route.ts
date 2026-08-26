import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

type JwtPayload = {
  id: string;
  role: "user" | "admin";
  iat?: number;
  exp?: number;
};

export async function GET() {
  try {
    const cookieStore = await cookies();

    // ========================================================
    // CHECK USER TOKEN
    // ========================================================

    let token = cookieStore.get("auth-token")?.value;
    let tokenType: "user" | "admin" | null = null;

    // ========================================================
    // CHECK ADMIN TOKEN
    // ========================================================

    if (!token) {
      token = cookieStore.get("admin-token")?.value;
      tokenType = token ? "admin" : null;
    } else {
      tokenType = "user";
    }

    if (!token || !tokenType) {
      return NextResponse.json(
        {
          success: true,
          authenticated: false,
          user: null,
        },
        { status: 200 }
      );
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");

      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          message: "Authentication service is not configured.",
        },
        { status: 500 }
      );
    }

    // ========================================================
    // VERIFY TOKEN
    // ========================================================

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as JwtPayload;

    if (!decoded.id || !decoded.role) {
      return NextResponse.json(
        {
          success: true,
          authenticated: false,
          user: null,
        },
        { status: 200 }
      );
    }

    // ========================================================
    // DATABASE
    // ========================================================

    await connectDB();

    const user = await User.findById(decoded.id)
      .select("_id name email role")
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          success: true,
          authenticated: false,
          user: null,
        },
        { status: 200 }
      );
    }

    // ========================================================
    // ROLE CONSISTENCY CHECK
    // ========================================================

    if (user.role !== decoded.role) {
      return NextResponse.json(
        {
          success: true,
          authenticated: false,
          user: null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        authenticated: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("AUTH ME ERROR:", error);

    return NextResponse.json(
      {
        success: true,
        authenticated: false,
        user: null,
      },
      { status: 200 }
    );
  }
}