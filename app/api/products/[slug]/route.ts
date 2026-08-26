import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

type Context = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  req: Request,
  { params }: Context
) {
  try {
    await connectDB();

    const { slug } = await params;

    if (!slug?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Product slug is required.",
        },
        { status: 400 }
      );
    }

    const product = await Product.findOne({
      slug: slug.trim().toLowerCase(),
      status: "active",
    }).select("-__v");

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch product.",
      },
      { status: 500 }
    );
  }
}