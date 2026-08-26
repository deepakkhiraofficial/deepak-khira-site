import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
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
    // DASHBOARD STATISTICS
    // ============================================================

    const [
      totalUsers,
      totalAdmins,
      totalProducts,
      activeProducts,
      draftProducts,
      featuredProducts,
      lowStockProducts,
      outOfStockProducts,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),

      User.countDocuments({ role: "admin" }),

      Product.countDocuments(),

      Product.countDocuments({
        status: "active",
      }),

      Product.countDocuments({
        status: "draft",
      }),

      Product.countDocuments({
        featured: true,
        status: "active",
      }),

      Product.countDocuments({
        status: "active",
        stock: {
          $gt: 0,
          $lte: 10,
        },
      }),

      Product.countDocuments({
        stock: {
          $lte: 0,
        },
      }),
    ]);

    // ============================================================
    // RESPONSE
    // ============================================================

    return NextResponse.json(
      {
        success: true,

        data: {
          users: {
            total: totalUsers,
            admins: totalAdmins,
          },

          products: {
            total: totalProducts,
            active: activeProducts,
            draft: draftProducts,
            featured: featuredProducts,
            lowStock: lowStockProducts,
            outOfStock: outOfStockProducts,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(
      "ADMIN DASHBOARD API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load dashboard statistics.",
      },
      { status: 500 }
    );
  }
}