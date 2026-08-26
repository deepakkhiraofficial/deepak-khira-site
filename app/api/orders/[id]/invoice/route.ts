import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export async function GET(
    req: Request,
    {
        params,
    }: {
        params: Promise<{
            id: string;
        }>;
    }
) {
    try {
        // ========================================================
        // PARAMS
        // ========================================================

        const { id } = await params;

        // ========================================================
        // VALIDATE ORDER ID
        // ========================================================

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid order ID.",
                },
                {
                    status: 400,
                }
            );
        }

        // ========================================================
        // DATABASE
        // ========================================================

        await connectDB();

        // ========================================================
        // FIND ORDER
        // ========================================================

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
                .lean();

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Order not found.",
                },
                {
                    status: 404,
                }
            );
        }

        // ========================================================
        // TEMPORARY JSON INVOICE
        // ========================================================
        // IMPORTANT:
        // This endpoint currently returns invoice data as JSON.
        // It does NOT generate a PDF yet.
        // ========================================================

        return NextResponse.json(
            {
                success: true,

                invoice: {
                    orderId: order._id,

                    orderDate:
                        order.createdAt,

                    status:
                        order.status,

                    customer: {
                        name:
                            order.user?.name ||
                            order.shippingAddress
                                ?.fullName ||
                            "N/A",

                        email:
                            order.user?.email ||
                            "N/A",

                        phone:
                            order.shippingAddress
                                ?.phone ||
                            "N/A",
                    },

                    shippingAddress:
                        order.shippingAddress,

                    payment:
                        order.payment,

                    items:
                        order.items,

                    itemsTotal:
                        order.itemsTotal,

                    shippingPrice:
                        order.shippingPrice,

                    taxPrice:
                        order.taxPrice,

                    totalPrice:
                        order.totalPrice,
                },
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "INVOICE ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to generate invoice.",
            },
            {
                status: 500,
            }
        );
    }
}