import { NextResponse } from "next/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import razorpay from "@/lib/razorpay";

export const runtime = "nodejs";

type AuthPayload = {
  id: string;
  role: "user" | "admin";
  iat?: number;
  exp?: number;
};

function getAuthUser(
  req: Request
): AuthPayload | null {
  const cookieHeader =
    req.headers.get("cookie") || "";

  const match = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) =>
      cookie.startsWith("auth-token=")
    );

  if (!match || !process.env.JWT_SECRET) {
    return null;
  }

  try {
    const token = match.slice(
      "auth-token=".length
    );

    return jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as AuthPayload;
  } catch {
    return null;
  }
}

export async function POST(
  req: Request
) {
  try {
    await connectDB();

    const user = getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login before making payment.",
        },
        { status: 401 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        user.id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user.",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    const internalOrderId =
      String(body.orderId || "").trim();

    if (
      !mongoose.Types.ObjectId.isValid(
        internalOrderId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order.",
        },
        { status: 400 }
      );
    }

    const order =
      await Order.findOne({
        _id: internalOrderId,
        user: user.id,
        "payment.method": "ONLINE",
      });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 }
      );
    }

    if (
      order.payment.status === "captured" &&
      order.payment.paid === true
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This order is already paid.",
        },
        { status: 409 }
      );
    }

    const amount = Math.round(
      Number(order.totalPrice) * 100
    );

    if (
      !Number.isInteger(amount) ||
      amount < 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment amount must be at least ₹1.",
        },
        { status: 400 }
      );
    }

    const keyId =
      process.env
        .NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!keyId) {
      console.error(
        "NEXT_PUBLIC_RAZORPAY_KEY_ID is missing."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Payment gateway is not configured.",
        },
        { status: 500 }
      );
    }

    /*
     * Create Razorpay order.
     *
     * Amount is always calculated on the
     * server from our MongoDB order.
     */
    const razorpayOrder =
      await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt:
          `order_${order._id.toString()}`,
        notes: {
          internal_order_id:
            order._id.toString(),
          user_id: user.id,
        },
        payment_capture: true,
      });

    if (
      !razorpayOrder ||
      !razorpayOrder.id
    ) {
      throw new Error(
        "Razorpay did not return an order ID."
      );
    }

    order.payment.razorpayOrderId =
      razorpayOrder.id;

    order.payment.status =
      "pending";

    order.payment.paid =
      false;

    order.payment.failureReason =
      "";

    await order.save();

    return NextResponse.json(
      {
        success: true,

        key: keyId,

        razorpayOrder: {
          id: razorpayOrder.id,
          amount:
            razorpayOrder.amount,
          currency:
            razorpayOrder.currency,
        },

        order: {
          id: order._id.toString(),
          totalPrice:
            order.totalPrice,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "RAZORPAY CREATE ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to initialize online payment.",
      },
      { status: 500 }
    );
  }
}