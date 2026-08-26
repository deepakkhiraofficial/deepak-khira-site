import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

type Context = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _req: Request,
  { params }: Context
) {
  try {
    const { slug } = await params;

    const normalizedSlug = slug?.trim().toLowerCase();

    if (!normalizedSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Product slug is required.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const product = await Product.findOne({
      slug: normalizedSlug,
      status: "active",
    })
      .select(
        "_id name slug description category price stock inStock images featured status rating popularityScore createdAt updatedAt"
      )
      .lean();

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch product.",
      },
      {
        status: 500,
      }
    );
  }
}