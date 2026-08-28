import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

// ============================================================
// CATEGORY API
// ============================================================

export async function GET() {
  try {
    await connectDB();

    // Only active products should contribute public categories.
    const categories = await Product.distinct(
      "category",
      {
        status: "active",
      }
    );

    // Clean + normalize categories.
    const normalizedCategories = Array.from(
      new Set(
        categories
          .filter(
            (category): category is string =>
              typeof category === "string"
          )
          .map((category) =>
            category.trim()
          )
          .filter(Boolean)
      )
    ).sort((a, b) =>
      a.localeCompare(b)
    );

    return NextResponse.json(
      {
        success: true,
        categories: normalizedCategories,
        count:
          normalizedCategories.length,
      },
      {
        status: 200,

        headers: {
          // CDN cache for 5 minutes.
          "Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=900",

          // Netlify/CDN friendly cache header.
          "CDN-Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=900",

          "Vary": "Accept-Encoding",
        },
      }
    );
  } catch (error) {
    console.error(
      "CATEGORY API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load categories.",
        categories: [],
        count: 0,
      },
      {
        status: 500,
      }
    );
  }
}