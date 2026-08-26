import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  if (!body.ids || !Array.isArray(body.ids)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    await Product.deleteMany({ _id: { $in: body.ids } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
