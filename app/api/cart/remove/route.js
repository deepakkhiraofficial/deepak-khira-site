import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import { getUserIdFromReq, ensureDb } from "../_helpers";

export async function POST(req) {
  try {
    await ensureDb();
    const { productId } = await req.json();
    if (!productId)
      return NextResponse.json(
        { message: "productId required" },
        { status: 400 }
      );

    const userId = await getUserIdFromReq(req);
    if (userId) {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) return NextResponse.json({ cart: { items: [] } });
      cart.items = cart.items.filter(
        (it) => it.product.toString() !== productId.toString()
      );
      await cart.save();
      const populated = await Cart.findById(cart._id)
        .populate("items.product")
        .lean();
      return NextResponse.json({ cart: populated });
    }

    // guest
    const existingCookie = req.cookies.get("guest-cart")?.value;
    let guestCart = [];
    try {
      guestCart = existingCookie ? JSON.parse(existingCookie) : [];
    } catch (e) {
      guestCart = [];
    }
    guestCart = guestCart.filter((it) => it.productId !== productId);
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
