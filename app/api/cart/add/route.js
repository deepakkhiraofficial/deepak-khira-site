// app/api/cart/add/route.js
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Cart from "@/models/Cart";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const COOKIE_NAME = "guest-cart";
const JWT_COOKIE = "token"; // adjust if you use a different cookie name for user token

async function getUserIdFromReq(req) {
  try {
    const token = req.cookies.get(JWT_COOKIE)?.value;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.id || payload._id || null;
  } catch (e) {
    return null;
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { productId, quantity = 1 } = body || {};

    if (!productId) {
      return NextResponse.json(
        { message: "productId is required" },
        { status: 400 }
      );
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return NextResponse.json(
        { message: "quantity must be a positive integer" },
        { status: 400 }
      );
    }

    // validate product
    const product = await Product.findById(productId).lean();
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < qty) {
      return NextResponse.json(
        { message: "Requested quantity exceeds stock" },
        { status: 400 }
      );
    }

    // determine user
    const userId = await getUserIdFromReq(req);

    if (userId) {
      // Logged-in user: save cart in DB
      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        cart = await Cart.create({
          user: userId,
          items: [{ product: productId, quantity: qty }],
        });
      } else {
        // check if product exists in cart
        const idx = cart.items.findIndex(
          (it) => it.product.toString() === productId.toString()
        );
        if (idx > -1) {
          cart.items[idx].quantity += qty; // increment
        } else {
          cart.items.push({ product: productId, quantity: qty });
        }
        await cart.save();
      }

      // populate product details for response
      const populated = await Cart.findById(cart._id)
        .populate("items.product")
        .lean();
      return NextResponse.json(
        { message: "Added to cart", cart: populated },
        { status: 200 }
      );
    } else {
      // Guest: use cookie. Save minimal { productId, quantity } array
      const existingCookie = req.cookies.get(COOKIE_NAME)?.value;
      let guestCart = [];
      try {
        guestCart = existingCookie ? JSON.parse(existingCookie) : [];
      } catch (e) {
        guestCart = [];
      }

      const idx = guestCart.findIndex((it) => it.productId === productId);
      if (idx > -1) {
        guestCart[idx].quantity = guestCart[idx].quantity + qty;
      } else {
        guestCart.push({
          productId,
          quantity: qty,
          addedAt: new Date().toISOString(),
        });
      }

      const res = NextResponse.json(
        { message: "Added to guest cart", cart: guestCart },
        { status: 200 }
      );

      // set cookie (not httpOnly so client JS can read)
      res.cookies.set(COOKIE_NAME, JSON.stringify(guestCart), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
      });

      return res;
    }
  } catch (error) {
    console.error("CART ADD ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
