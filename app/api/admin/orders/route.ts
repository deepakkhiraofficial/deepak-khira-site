import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        // ============================================================
        // ADMIN AUTHORIZATION
        // ============================================================

        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Admin authorization required.",
                },
                { status: 401 }
            );
        }

        // ============================================================
        // DATABASE
        // ============================================================

        await connectDB();

        // ============================================================
        // QUERY PARAMETERS
        // ============================================================

        const { searchParams } = new URL(req.url);

        const search =
            searchParams.get("search")?.trim() || "";

        const pageParam =
            Number(searchParams.get("page")) || 1;

        const limitParam =
            Number(searchParams.get("limit")) || 10;

        const status =
            searchParams.get("status")?.trim() || "";

        const page = Math.max(1, pageParam);

        const limit = Math.min(
            Math.max(1, limitParam),
            100
        );

        const skip = (page - 1) * limit;

        // ============================================================
        // FILTER
        // ============================================================

        const filter: Record<string, unknown> = {};

        // Status filter
        if (status) {
            filter.status = status;
        }

        // ============================================================
        // SEARCH
        // ============================================================
        // Search by MongoDB Order ID.
        // Customer-name/email search should be added according
        // to the actual Order schema.
        // ============================================================

        if (search) {
            if (search.length === 24) {
                filter._id = search;
            }
        }

        // ============================================================
        // FETCH ORDERS
        // ============================================================

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Order.countDocuments(filter),
        ]);

        // ============================================================
        // RESPONSE
        // ============================================================

        return NextResponse.json(
            {
                success: true,

                orders,

                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },

                count: orders.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(
            "ADMIN ORDERS ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to fetch orders.",
            },
            { status: 500 }
        );
    }
}