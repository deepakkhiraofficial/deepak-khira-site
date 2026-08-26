import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  try {
    await connectDB();

    const token = req.cookies.get("admin-token")?.value;
    if (!token || !token.startsWith("ADMIN-")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token.replace("ADMIN-", ""),
      process.env.JWT_SECRET
    );
    const body = await req.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and Email are required" },
        { status: 400 }
      );
    }

    const updatedAdmin = await User.findByIdAndUpdate(
      decoded.id,
      { name, email },
      { new: true }
    ).select("name email");

    return NextResponse.json({ message: "Admin updated", data: updatedAdmin });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
