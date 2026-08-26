import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";

// ============================================================
// GET PRODUCT BY ID
// ============================================================

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // --------------------------------------------------------
    // Validate ID
    // --------------------------------------------------------

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Find Product
    // --------------------------------------------------------

    const product = await Product.findById(id).select("-__v").lean();

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
  } catch (error) {
    console.error("ADMIN GET PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch product.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// UPDATE PRODUCT BY ID
// ============================================================

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // --------------------------------------------------------
    // Validate ID
    // --------------------------------------------------------

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Request Body
    // --------------------------------------------------------

    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Clean Data
    // --------------------------------------------------------

    const updateData = {};

    if (typeof body.name === "string") {
      updateData.name = body.name.trim();
    }

    if (typeof body.description === "string") {
      updateData.description = body.description.trim();
    }

    if (typeof body.category === "string") {
      updateData.category = body.category.trim();
    }

    if (body.price !== undefined) {
      const price = Number(body.price);

      if (!Number.isFinite(price) || price < 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid product price.",
          },
          { status: 400 }
        );
      }

      updateData.price = price;
    }

    if (body.stock !== undefined) {
      const stock = Number(body.stock);

      if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) {
        return NextResponse.json(
          {
            success: false,
            message: "Stock must be a valid whole number.",
          },
          { status: 400 }
        );
      }

      updateData.stock = stock;
    }

    if (Array.isArray(body.images)) {
      updateData.images = body.images.filter(
        (image) => typeof image === "string" && image.trim().length > 0
      );
    }

    if (body.featured !== undefined) {
      updateData.featured = Boolean(body.featured);
    }

    if (body.status === "active" || body.status === "draft") {
      updateData.status = body.status;
    }

    // --------------------------------------------------------
    // Validate Required Fields
    // --------------------------------------------------------

    if (updateData.name !== undefined && updateData.name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name must be at least 2 characters.",
        },
        { status: 400 }
      );
    }

    if (
      updateData.description !== undefined &&
      updateData.description.length < 10
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Product description must be at least 10 characters.",
        },
        { status: 400 }
      );
    }

    if (updateData.category !== undefined && updateData.category.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Product category must be at least 2 characters.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Prevent Empty Update
    // --------------------------------------------------------

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid fields provided for update.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Update Product
    // --------------------------------------------------------

    const product = await Product.findByIdAndUpdate(
      id,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-__v")
      .lean();

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
        message: "Product updated successfully.",
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ADMIN UPDATE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Unable to update product.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE PRODUCT BY ID
// ============================================================

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // --------------------------------------------------------
    // Validate ID
    // --------------------------------------------------------

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Delete
    // --------------------------------------------------------

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
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
        message: "Product deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ADMIN DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete product.",
      },
      { status: 500 }
    );
  }
}
