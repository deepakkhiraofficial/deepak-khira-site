import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

type AuthPayload = {
  id: string;
  role: "user" | "admin";
};

function getUserFromRequest(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";

  const match = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) =>
      cookie.startsWith("auth-token=")
    );

  if (!match) {
    return null;
  }

  const token = match.split("=")[1];

  if (!token || !process.env.JWT_SECRET) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as AuthPayload;

    if (
      !decoded.id ||
      decoded.role !== "user"
    ) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

// ============================================================
// GET MY ORDERS
// ============================================================

export async function GET(req: Request) {
  try {
    await connectDB();

    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to view your orders.",
        },
        { status: 401 }
      );
    }

    const orders = await Order.find({
      user: user.id,
    })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    return NextResponse.json(
      {
        success: true,
        orders,
        count: orders.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch orders.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// CREATE ORDER
// ============================================================

export async function POST(req: Request) {
  try {
    await connectDB();

    // --------------------------------------------------------
    // AUTHENTICATION
    // --------------------------------------------------------

    const authUser =
      getUserFromRequest(req);

    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login before placing an order.",
        },
        { status: 401 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        authUser.id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------------
    // VERIFY USER
    // --------------------------------------------------------

    const user = await User.findById(
      authUser.id
    ).select("_id name email");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------------
    // REQUEST BODY
    // --------------------------------------------------------

    const body = await req.json();

    const items = Array.isArray(body.items)
      ? body.items
      : [];

    const shippingAddress =
      body.shippingAddress || {};

    const paymentMethod =
      body.paymentMethod === "ONLINE"
        ? "ONLINE"
        : "COD";

    // --------------------------------------------------------
    // CART VALIDATION
    // --------------------------------------------------------

    if (!items.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    if (items.length > 50) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many products in one order.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // ADDRESS VALIDATION
    // --------------------------------------------------------

    const fullName =
      String(
        shippingAddress.fullName || ""
      ).trim();

    const address =
      String(
        shippingAddress.address || ""
      ).trim();

    const city =
      String(
        shippingAddress.city || ""
      ).trim();

    const region =
      String(
        shippingAddress.region || ""
      ).trim();

    const postalCode =
      String(
        shippingAddress.postalCode || ""
      ).trim();

    const country =
      String(
        shippingAddress.country || "India"
      ).trim();

    const phone =
      String(
        shippingAddress.phone || ""
      ).replace(/\D/g, "");

    if (fullName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid full name is required.",
        },
        { status: 400 }
      );
    }

    if (
      address.length < 10 ||
      address.length > 250
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid delivery address.",
        },
        { status: 400 }
      );
    }

    if (city.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid city is required.",
        },
        { status: 400 }
      );
    }

    if (region.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid state is required.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(postalCode)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Valid 6-digit PIN code is required.",
        },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Valid 10-digit mobile number is required.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // GET PRODUCT IDS
    // --------------------------------------------------------

    const productIds = items.map(
      (item: any) =>
        item?.productId
    );

    for (const productId of productIds) {
      if (
        !mongoose.Types.ObjectId.isValid(
          productId
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid product ID.",
          },
          { status: 400 }
        );
      }
    }

    // --------------------------------------------------------
    // FETCH PRODUCTS FROM DATABASE
    // IMPORTANT:
    // NEVER TRUST PRICE FROM FRONTEND
    // --------------------------------------------------------

    const products =
      await Product.find({
        _id: {
          $in: productIds,
        },
        status: "active",
      })
        .select(
          "_id name price stock images inStock"
        )
        .lean();

    if (
      products.length !==
      new Set(productIds).size
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more products are no longer available.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // BUILD ORDER ITEMS
    // --------------------------------------------------------

    const orderItems: any[] = [];

    let itemsTotal = 0;

    for (const item of items) {
      const product = products.find(
        (p: any) =>
          p._id.toString() ===
          String(item.productId)
      );

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Product not found.",
          },
          { status: 404 }
        );
      }

      const quantity = Number(
        item.quantity
      );

      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 100
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid quantity for ${product.name}.`,
          },
          { status: 400 }
        );
      }

      // ------------------------------------------------------
      // STOCK CHECK
      // ------------------------------------------------------

      if (
        product.stock < quantity ||
        product.inStock === false
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `${product.name} is out of stock or has insufficient stock.`,
          },
          { status: 400 }
        );
      }

      const itemTotal =
        Number(product.price) *
        quantity;

      itemsTotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: Number(product.price),
        quantity,
        image:
          product.images?.[0] || "",
      });
    }

    // --------------------------------------------------------
    // SHIPPING
    // --------------------------------------------------------

    const shippingPrice =
      itemsTotal > 0 ? 50 : 0;

    // --------------------------------------------------------
    // TAX
    // --------------------------------------------------------
    // Change this later according to
    // your actual GST/business logic.

    const taxPrice = 0;

    const totalPrice =
      itemsTotal +
      shippingPrice +
      taxPrice;

    // --------------------------------------------------------
    // CREATE ORDER
    // --------------------------------------------------------

    const order =
      await Order.create({
        user: user._id,

        items: orderItems,

        shippingAddress: {
          fullName,
          address,
          city,
          region,
          postalCode,
          country,
          phone,
        },

        payment: {
          method: paymentMethod,
          status: paymentMethod === "COD" ? "pending" : "pending",
          paid: false,
          paidAt: undefined,
          transactionId: "",
          razorpayOrderId: "",
          razorpayPaymentId: "",
          razorpaySignature: "",
          failureReason: "",
        },

        itemsTotal,
        shippingPrice,
        taxPrice,
        totalPrice,

        status: "placed",

        statusHistory: [
          {
            status: "placed",
            message:
              "Order placed successfully.",
            changedBy: user._id,
            createdAt: new Date(),
          },
        ],

        notes: "",
      });

    // --------------------------------------------------------
    // REDUCE STOCK
    // --------------------------------------------------------

    if (paymentMethod === "COD") {
      for (const item of orderItems) {
        const updatedProduct =
          await Product.findOneAndUpdate(
            {
              _id: item.product,
              stock: {
                $gte: item.quantity,
              },
            },
            {
              $inc: {
                stock: -item.quantity,
              },
            },
            {
              new: true,
            }
          );
    
        if (!updatedProduct) {
          console.error(
            "STOCK UPDATE FAILED FOR PRODUCT:",
            item.product
          );
        } else {
          updatedProduct.inStock =
            updatedProduct.stock > 0;
    
          await updatedProduct.save();
        }
      }
    }
    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message:
          "Order placed successfully.",

        order: {
          id: order._id.toString(),
          status: order.status,
          totalPrice:
            order.totalPrice,
          paymentMethod:
            order.payment.method,
        },

        
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to place order. Please try again.",
      },
      { status: 500 }
    );
  }
}

