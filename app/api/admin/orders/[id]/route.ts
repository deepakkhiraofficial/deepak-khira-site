import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// ============================================================
// ALLOWED ORDER STATUSES
// ============================================================

const ALLOWED_STATUSES = [
    "placed",
    "confirmed",
    "packed",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
] as const;

// ============================================================
// GET ORDER DETAILS
// ============================================================

export async function GET(
    request: Request,
    {
        params,
    }: {
        params: Promise<{ id: string }>;
    }
) {
    try {
        // --------------------------------------------------------
        // ADMIN AUTH
        // --------------------------------------------------------

        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Admin authorization required.",
                },
                { status: 401 }
            );
        }

        // --------------------------------------------------------
        // PARAMS
        // --------------------------------------------------------

        const { id } = await params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
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
        // DATABASE
        // --------------------------------------------------------

        await connectDB();

        // --------------------------------------------------------
        // GET ORDER
        // --------------------------------------------------------

        const order =
            await Order.findById(id)
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "items.product",
                    "name slug images price"
                )
                .populate(
                    "statusHistory.changedBy",
                    "name email"
                )
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
            "ADMIN ORDER GET ERROR:",
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

// ============================================================
// UPDATE ORDER
// ============================================================

export async function PUT(
    request: Request,
    {
        params,
    }: {
        params: Promise<{ id: string }>;
    }
) {
    try {
        // --------------------------------------------------------
        // ADMIN AUTH
        // --------------------------------------------------------

        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Admin authorization required.",
                },
                { status: 401 }
            );
        }

        // --------------------------------------------------------
        // PARAMS
        // --------------------------------------------------------

        const { id } = await params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
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
        // BODY
        // --------------------------------------------------------

        const body = await request.json();

        const {
            status,
            paymentPaid,
            transactionId,
            notes,
        } = body;

        // --------------------------------------------------------
        // VALIDATE STATUS
        // --------------------------------------------------------

        if (
            status !== undefined &&
            !ALLOWED_STATUSES.includes(status)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid order status.",
                    allowedStatuses:
                        ALLOWED_STATUSES,
                },
                { status: 400 }
            );
        }

        // --------------------------------------------------------
        // DATABASE
        // --------------------------------------------------------

        await connectDB();

        const order =
            await Order.findById(id);

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

        // --------------------------------------------------------
        // TRACK CHANGES
        // --------------------------------------------------------

        let statusChanged = false;

        // ========================================================
        // STATUS UPDATE
        // ========================================================

        if (
            status !== undefined &&
            status !== order.status
        ) {
            const oldStatus =
                order.status;

            order.status = status;

            statusChanged = true;

            order.statusHistory.push({
                status,
                message:
                    `Order status changed from ${oldStatus} to ${status}.`,
                changedBy: admin.id,
                createdAt: new Date(),
            });
        }

        // ========================================================
        // PAYMENT UPDATE
        // ========================================================

        if (
            paymentPaid !== undefined
        ) {
            const paid =
                Boolean(paymentPaid);

            order.payment.paid =
                paid;

            if (paid) {
                order.payment.paidAt =
                    order.payment.paidAt ||
                    new Date();
            } else {
                order.payment.paidAt =
                    undefined;
            }
        }

        // ========================================================
        // TRANSACTION ID
        // ========================================================

        if (
            transactionId !==
            undefined
        ) {
            order.payment.transactionId =
                String(
                    transactionId || ""
                ).trim();
        }

        // ========================================================
        // ADMIN NOTES
        // ========================================================

        if (
            notes !== undefined
        ) {
            order.notes =
                String(
                    notes || ""
                ).trim();
        }

        // ========================================================
        // SAVE
        // ========================================================

        await order.save();

        // ========================================================
        // RETURN UPDATED ORDER
        // ========================================================

        const updatedOrder =
            await Order.findById(id)
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "items.product",
                    "name slug images price"
                )
                .populate(
                    "statusHistory.changedBy",
                    "name email"
                )
                .lean();

        return NextResponse.json(
            {
                success: true,

                message: statusChanged
                    ? "Order updated successfully."
                    : "Order details updated successfully.",

                order: updatedOrder,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(
            "ADMIN ORDER UPDATE ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to update order.",
            },
            { status: 500 }
        );
    }
}