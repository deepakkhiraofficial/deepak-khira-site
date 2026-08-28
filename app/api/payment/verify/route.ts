import { NextResponse } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import razorpay from "@/lib/razorpay";

export const runtime = "nodejs";

type AuthPayload = {
  id: string;
  role: "user" | "admin";
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

function safeCompareHex(
  expected: string,
  received: string
): boolean {
  if (
    !/^[a-f0-9]{64}$/i.test(expected) ||
    !/^[a-f0-9]{64}$/i.test(received)
  ) {
    return false;
  }

  const a = Buffer.from(
    expected,
    "hex"
  );

  const b = Buffer.from(
    received,
    "hex"
  );

  return (
    a.length === b.length &&
    crypto.timingSafeEqual(a, b)
  );
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
          message: "Please login.",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    const internalOrderId =
      String(body.orderId || "").trim();

    const paymentId =
      String(
        body.razorpay_payment_id || ""
      ).trim();

    const razorpayOrderId =
      String(
        body.razorpay_order_id || ""
      ).trim();

    const signature =
      String(
        body.razorpay_signature || ""
      ).trim();

    if (
      !mongoose.Types.ObjectId.isValid(
        internalOrderId
      ) ||
      !paymentId ||
      !razorpayOrderId ||
      !signature
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid payment details.",
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

    /*
     * Idempotency.
     */
    if (
      order.payment.status ===
        "captured" &&
      order.payment.paid
    ) {
      return NextResponse.json({
        success: true,
        message:
          "Payment already verified.",
        orderId:
          order._id.toString(),
      });
    }

    const storedOrderId =
      order.payment.razorpayOrderId;

    if (
      !storedOrderId ||
      storedOrderId !==
        razorpayOrderId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment order mismatch.",
        },
        { status: 400 }
      );
    }

    const secret =
      process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      throw new Error(
        "RAZORPAY_KEY_SECRET is missing."
      );
    }

    /*
     * Razorpay required signature:
     *
     * order_id|payment_id
     */
    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          secret
        )
        .update(
          `${storedOrderId}|${paymentId}`
        )
        .digest("hex");

    if (
      !safeCompareHex(
        expectedSignature,
        signature
      )
    ) {
      order.payment.status =
        "failed";

      order.payment.failureReason =
        "Invalid Razorpay signature.";

      await order.save();

      return NextResponse.json(
        {
          success: false,
          message:
            "Payment verification failed.",
        },
        { status: 400 }
      );
    }

    /*
     * Server-to-server verification.
     */
    const payment =
      await razorpay.payments.fetch(
        paymentId
      );

    if (
      payment.order_id !==
      storedOrderId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment order mismatch.",
        },
        { status: 400 }
      );
    }

    const expectedAmount =
      Math.round(
        Number(order.totalPrice) *
          100
      );

    if (
      Number(payment.amount) !==
      expectedAmount
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment amount mismatch.",
        },
        { status: 400 }
      );
    }

    if (
      payment.currency !== "INR"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment currency mismatch.",
        },
        { status: 400 }
      );
    }

    /*
     * Payment can be authorized first.
     * Do NOT mark it paid until captured.
     */
    if (
      payment.status !== "captured"
    ) {
      order.payment.status =
        payment.status ===
        "failed"
          ? "failed"
          : "authorized";

      order.payment.razorpayPaymentId =
        paymentId;

      order.payment.razorpaySignature =
        signature;

      order.payment.transactionId =
        paymentId;

      await order.save();

      return NextResponse.json(
        {
          success: false,
          captured: false,
          message:
            "Payment is authorized but not captured yet.",
        },
        { status: 409 }
      );
    }

    /*
     * At this point payment is captured.
     *
     * IMPORTANT:
     * Webhook will also handle the final
     * payment state. This endpoint is used
     * for immediate user feedback.
     */
    order.payment.status =
      "captured";

    order.payment.paid =
      true;

    order.payment.paidAt =
      order.payment.paidAt ||
      new Date();

    order.payment.razorpayPaymentId =
      paymentId;

    order.payment.razorpaySignature =
      signature;

    order.payment.transactionId =
      paymentId;

    order.payment.failureReason =
      "";

    order.status =
      order.status ===
        "placed"
        ? "confirmed"
        : order.status;

        const alreadyConfirmed =
        order.statusHistory.some(
          (entry: {
            status?: string;
            message?: string;
            createdAt?: Date;
          }) =>
            entry.status === "confirmed" &&
            entry.message ===
              "Online payment captured successfully."
        );

    if (!alreadyConfirmed) {
      order.statusHistory.push({
        status: "confirmed",
        message:
          "Online payment captured successfully.",
        changedBy:
          mongoose.Types.ObjectId.createFromHexString(
            user.id
          ),
        createdAt:
          new Date(),
      });
    }

    await order.save();

    return NextResponse.json({
      success: true,
      captured: true,
      message:
        "Payment successful.",
      orderId:
        order._id.toString(),
      paymentId,
    });
  } catch (error) {
    console.error(
      "RAZORPAY VERIFY ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to verify payment.",
      },
      { status: 500 }
    );
  }
}