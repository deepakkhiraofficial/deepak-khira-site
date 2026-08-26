import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { getUserIdFromReq, ensureDb } from "../_helpers";

export async function POST(req) {
  try {
    await ensureDb();
    const body = await req.json();
    const { productId, quantity } = body || {};
    if (!productId)
      return NextResponse.json(
        { message: "productId required" },
        { status: 400 }
      );
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 0)
      return NextResponse.json(
        { message: "quantity must be integer >= 0" },
        { status: 400 }
      );

    const product = await Product.findById(productId).lean();
    if (!product)
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    if (qty > product.stock)
      return NextResponse.json(
        { message: "Requested quantity exceeds stock" },
        { status: 400 }
      );

    const userId = await getUserIdFromReq(req);
    if (userId) {
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = await Cart.create({
          user: userId,
          items: qty === 0 ? [] : [{ product: productId, quantity: qty }],
        });
      } else {
        const idx = cart.items.findIndex(
          (it) => it.product.toString() === productId.toString()
        );
        if (idx === -1 && qty > 0)
          cart.items.push({ product: productId, quantity: qty });
        else if (idx > -1) {
          if (qty === 0) cart.items.splice(idx, 1);
          else cart.items[idx].quantity = qty;
        }
        await cart.save();
      }
      const populated = await Cart.findById(cart._id)
        .populate("items.product")
        .lean();
      return NextResponse.json({ cart: populated });
    }

    // Guest cookie flow
    const existingCookie = req.cookies.get("guest-cart")?.value;
    let guestCart = [];
    try {
      guestCart = existingCookie ? JSON.parse(existingCookie) : [];
    } catch (e) {
      guestCart = [];
    }

    const idx = guestCart.findIndex((it) => it.productId === productId);
    if (idx > -1) {
      if (qty === 0) guestCart.splice(idx, 1);
      else guestCart[idx].quantity = qty;
    } else if (qty > 0) {
      guestCart.push({
        productId,
        quantity: qty,
        addedAt: new Date().toISOString(),
      });
    }

    const res = NextResponse.json({ cart: guestCart });
    res.cookies.set("guest-cart", JSON.stringify(guestCart), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
