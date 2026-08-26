import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

type AuthPayload = {
  id: string;
  role: "user" | "admin";
};

type Context = {
  params: Promise<{
    id: string;
  }>;
};

// ============================================================
// AUTH
// ============================================================

function getUserFromRequest(
  req: Request
) {
  const cookieHeader =
    req.headers.get("cookie") || "";

  const match = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) =>
      cookie.startsWith(
        "auth-token="
      )
    );

  if (!match) {
    return null;
  }

  const token =
    match.substring(
      "auth-token=".length
    );

  if (
    !token ||
    !process.env.JWT_SECRET
  ) {
    return null;
  }

  try {
    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as AuthPayload;

    if (
      !decoded.id ||
      decoded.role !== "user"
    ) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

// ============================================================
// GET SINGLE ORDER
// ============================================================

export async function GET(
  req: Request,
  { params }: Context
) {
  try {
    await connectDB();

    // --------------------------------------------------------
    // AUTH
    // --------------------------------------------------------

    const user =
      getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login to view this order.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------------
    // PARAMS
    // --------------------------------------------------------

    const { id } =
      await params;

    if (
      !id ||
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid order ID.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // SECURITY
    //
    // IMPORTANT:
    // User can only access THEIR OWN order.
    // --------------------------------------------------------

    const order =
      await Order.findOne({
        _id: id,
        user: user.id,
      })
        .select("-__v")
        .lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET SINGLE ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch order.",
      },
      { status: 500 }
    );
  }
}