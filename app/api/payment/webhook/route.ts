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
  const expected =
    crypto
      .createHmac(
        "sha256",
        secret
      )
      .update(rawBody)
      .digest("hex");

  if (
    !/^[a-f0-9]{64}$/i.test(
      expected
    ) ||
    !/^[a-f0-9]{64}$/i.test(
      signature
    )
  ) {
    return false;
  }

  const a = Buffer.from(
    expected,
    "hex"
  );

  const b = Buffer.from(
    signature,
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
    const webhookSecret =
      process.env
        .RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        "RAZORPAY_WEBHOOK_SECRET missing."
      );

      return NextResponse.json(
        {
          success: false,
        },
        { status: 500 }
      );
    }

    /*
     * IMPORTANT:
     * Read raw body BEFORE JSON parsing.
     */
    const rawBody =
      await req.text();

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
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid webhook signature.",
        },
        { status: 400 }
      );
    }

    const payload =
      JSON.parse(rawBody);

    const event =
      payload?.event;

    /*
     * Ignore unsupported events.
     */
    if (
      event !==
        "payment.captured" &&
      event !==
        "payment.failed" &&
      event !==
        "order.paid"
    ) {
      return NextResponse.json(
        {
          success: true,
          ignored: true,
        },
        { status: 200 }
      );
    }

    const paymentEntity =
      payload?.payload
        ?.payment?.entity;

    const orderEntity =
      payload?.payload
        ?.order?.entity;

    const paymentId =
      paymentEntity?.id;

    const razorpayOrderId =
      paymentEntity?.order_id ||
      orderEntity?.id;

    if (
      !paymentId ||
      !razorpayOrderId
    ) {
      return NextResponse.json(
        {
          success: true,
          ignored: true,
        },
        { status: 200 }
      );
    }

    await connectDB();

    const order =
      await Order.findOne({
        "payment.razorpayOrderId":
          razorpayOrderId,
      });

    if (!order) {
      console.error(
        "RAZORPAY WEBHOOK ORDER NOT FOUND:",
        razorpayOrderId
      );

      /*
       * Return 200 so Razorpay does not
       * repeatedly retry an event that
       * cannot be mapped.
       */
      return NextResponse.json(
        {
          success: true,
          ignored: true,
        },
        { status: 200 }
      );
    }

    /*
     * PAYMENT CAPTURED
     */
    if (
      event ===
        "payment.captured" ||
      event ===
        "order.paid"
    ) {
      if (
        order.payment.status !==
        "captured"
      ) {
        order.payment.status =
          "captured";

        order.payment.paid =
          true;

        order.payment.paidAt =
          order.payment.paidAt ||
          new Date();

        order.payment
          .razorpayPaymentId =
          paymentId;

        order.payment
          .transactionId =
          paymentId;

        order.payment
          .failureReason = "";

        if (
          order.status ===
          "placed"
        ) {
          order.status =
            "confirmed";
        }

        const exists =
  order.statusHistory.some(
    (entry: {
      status?: string;
      message?: string;
      createdAt?: Date;
    }) =>
      entry.message ===
      "Online payment captured successfully."
  );

        if (!exists) {
          order.statusHistory.push({
            status:
              "confirmed",

            message:
              "Online payment captured successfully.",

            createdAt:
              new Date(),
          });
        }

        await order.save();
      }
    }

    /*
     * PAYMENT FAILED
     */
    if (
      event ===
      "payment.failed"
    ) {
      if (
        order.payment.status !==
        "captured"
      ) {
        order.payment.status =
          "failed";

        order.payment.paid =
          false;

        order.payment
          .razorpayPaymentId =
          paymentId;

        order.payment
          .failureReason =
          paymentEntity
            ?.error_description ||
          "Razorpay payment failed.";

        await order.save();
      }
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
      },
      { status: 500 }
    );
  }
}