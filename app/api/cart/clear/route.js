import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import { getUserIdFromReq, ensureDb } from "../_helpers";

export async function POST(req) {
  try {
    await ensureDb();
    const userId = await getUserIdFromReq(req);
    if (userId) {
      await Cart.findOneAndDelete({ user: userId });
      return NextResponse.json({ cart: { items: [] } });
    }
    const res = NextResponse.json({ cart: [] });
    res.cookies.set("guest-cart", JSON.stringify([]), { path: "/", maxAge: 0 });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
