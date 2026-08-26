import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { getUserIdFromReq, ensureDb } from "../_helpers";


export async function GET(req) {
try {
await ensureDb();
const userId = await getUserIdFromReq(req);


if (userId) {
const cart = await Cart.findOne({ user: userId }).populate("items.product").lean();
return NextResponse.json({ cart: cart || { items: [] } });
}


// guest via cookie
const cookie = req.cookies.get("guest-cart")?.value;
let guest = [];
try { guest = cookie ? JSON.parse(cookie) : []; } catch(e){ guest = []; }


// fetch product details
const ids = guest.map(it => it.productId);
const products = ids.length ? await Product.find({ _id: { $in: ids } }).lean() : [];
const items = guest.map(g => ({ product: products.find(p=>p._id.toString()===g.productId) || null, quantity: g.quantity }));


return NextResponse.json({ cart: { items } });
} catch (err) {
console.error(err);
return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
}
}