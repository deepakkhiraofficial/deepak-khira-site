import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    // =========================================
    // ADMIN AUTH
    // =========================================

    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // =========================================
    // DATABASE
    // =========================================

    await connectDB();

    // =========================================
    // QUERY PARAMS
    // =========================================

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim() || "";

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(searchParams.get("limit")) || 10,
        1
      ),
      100
    );

    const skip = (page - 1) * limit;

    // =========================================
    // QUERY
    // =========================================

    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
        {
          slug: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // =========================================
    // FETCH
    // =========================================

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(query),
    ]);

    const totalPages =
      total === 0
        ? 1
        : Math.ceil(total / limit);

    // =========================================
    // RESPONSE
    // =========================================

    return NextResponse.json(
      {
        success: true,
        message: "Products fetched successfully.",
        products,
        total,
        page,
        limit,
        totalPages,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(
      "ADMIN PRODUCTS GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch products.",
      },
      { status: 500 }
    );
  }
}