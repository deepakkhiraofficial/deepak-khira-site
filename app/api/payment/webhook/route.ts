import { NextResponse } from "next/server";
import crypto from "crypto";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const runtime = "nodejs";

function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  if (!signature) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (
    !/^[a-f0-9]{64}$/i.test(expected) ||
    !/^[a-f0-9]{64}$/i.test(signature)
  ) {
    return false;
  }

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(signature, "hex");

  if (
    expectedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    expectedBuffer,
    receivedBuffer
  );
}

export async function POST(req: Request) {
  try {
    // ========================================================
    // WEBHOOK SECRET
    // ========================================================

    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        "RAZORPAY_WEBHOOK_SECRET is missing."
      );

      return NextResponse.json(
        {
          success: false,
          message: "Webhook is not configured.",
        },
        { status: 500 }
      );
    }

    // ========================================================
    // RAW BODY
    // ========================================================

    const rawBody = await req.text();

    const signature =
      req.headers.get(
        "x-razorpay-signature"
      );

    if (
      !signature ||
      !verifyWebhookSignature(
        rawBody,
        signature,
        webhookSecret
      )
    ) {
      console.error(
        "RAZORPAY WEBHOOK SIGNATURE INVALID"
      );

      return NextResponse.json(
        {
          success: false,
          message: "Invalid webhook signature.",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // PARSE PAYLOAD
    // ========================================================

    let payload: any;

    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON payload.",
        },
        { status: 400 }
      );
    }

    const event = payload?.event;

    console.log(
      "RAZORPAY WEBHOOK EVENT:",
      event
    );

    // ========================================================
    // EVENT
    // ========================================================

    if (
      event !== "payment.captured" &&
      event !== "order.paid" &&
      event !== "payment.failed"
    ) {
      return NextResponse.json(
        {
          success: true,
          ignored: true,
        },
        { status: 200 }
      );
    }

    // ========================================================
    // PAYMENT ENTITY
    // ========================================================

    const paymentEntity =
      payload?.payload?.payment?.entity;

    const orderEntity =
      payload?.payload?.order?.entity;

    const paymentId =
      paymentEntity?.id || "";

    const razorpayOrderId =
      paymentEntity?.order_id ||
      orderEntity?.id ||
      "";

    if (!razorpayOrderId) {
      console.error(
        "RAZORPAY WEBHOOK: ORDER ID MISSING"
      );

      return NextResponse.json(
        {
          success: false,
          message: "Razorpay order ID missing.",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // DATABASE
    // ========================================================

    await connectDB();

    const order = await Order.findOne({
      "payment.razorpayOrderId":
        razorpayOrderId,
    });

    if (!order) {
      console.error(
        "RAZORPAY WEBHOOK ORDER NOT FOUND:",
        razorpayOrderId
      );

      // Return non-2xx so Razorpay can retry.
      return NextResponse.json(
        {
          success: false,
          message: "Internal order not found.",
        },
        { status: 404 }
      );
    }

    // ========================================================
    // PAYMENT CAPTURED
    // ========================================================

    if (
      event === "payment.captured" ||
      event === "order.paid"
    ) {
      // ------------------------------------------------------
      // Amount validation
      // ------------------------------------------------------

      if (paymentEntity?.amount != null) {
        const expectedAmount = Math.round(
          Number(order.totalPrice) * 100
        );

        if (
          Number(paymentEntity.amount) !==
          expectedAmount
        ) {
          console.error(
            "RAZORPAY WEBHOOK AMOUNT MISMATCH",
            {
              expectedAmount,
              receivedAmount:
                paymentEntity.amount,
              orderId:
                order._id.toString(),
            }
          );

          return NextResponse.json(
            {
              success: false,
              message:
                "Payment amount mismatch.",
            },
            { status: 400 }
          );
        }
      }

      // ------------------------------------------------------
      // Currency validation
      // ------------------------------------------------------

      if (
        paymentEntity?.currency &&
        paymentEntity.currency !== "INR"
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

      // ------------------------------------------------------
      // Idempotency
      // ------------------------------------------------------

      if (
        order.payment.status !==
        "captured"
      ) {
        order.payment.status =
          "captured";

        order.payment.paid = true;

        order.payment.paidAt =
          order.payment.paidAt ||
          new Date();

        if (paymentId) {
          order.payment.razorpayPaymentId =
            paymentId;

          order.payment.transactionId =
            paymentId;
        }

        order.payment.failureReason = "";

        // ----------------------------------------------------
        // Order status
        // ----------------------------------------------------

        if (
          order.status === "placed"
        ) {
          order.status =
            "confirmed";
        }

        // ----------------------------------------------------
        // Status history
        // ----------------------------------------------------

        const alreadyRecorded =
          order.statusHistory.some(
            (entry: {
              status?: string;
              message?: string;
            }) =>
              entry.message ===
              "Online payment captured successfully."
          );

        if (!alreadyRecorded) {
          order.statusHistory.push({
            status: "confirmed",
            message:
              "Online payment captured successfully.",
            createdAt: new Date(),
          });
        }

        await order.save();

        console.log(
          "RAZORPAY PAYMENT CAPTURED:",
          {
            internalOrderId:
              order._id.toString(),
            razorpayOrderId,
            paymentId,
          }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message:
            "Payment captured successfully.",
        },
        { status: 200 }
      );
    }

    // ========================================================
    // PAYMENT FAILED
    // ========================================================

    if (
      event === "payment.failed"
    ) {
      // Never overwrite a captured payment
      if (
        order.payment.status !==
        "captured"
      ) {
        order.payment.status =
          "failed";

        order.payment.paid =
          false;

        if (paymentId) {
          order.payment.razorpayPaymentId =
            paymentId;
        }

        order.payment.failureReason =
          paymentEntity
            ?.error_description ||
          paymentEntity
            ?.error_reason ||
          "Razorpay payment failed.";

        await order.save();

        console.log(
          "RAZORPAY PAYMENT FAILED:",
          {
            internalOrderId:
              order._id.toString(),
            razorpayOrderId,
            paymentId,
          }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message:
            "Payment failure recorded.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "RAZORPAY WEBHOOK ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Webhook processing failed.",
      },
      { status: 500 }
    );
  }
}