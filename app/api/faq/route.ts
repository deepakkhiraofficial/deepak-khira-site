import connectDB from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const faqs = await FAQ.find().sort({ createdAt: -1 });
  return NextResponse.json(faqs);
}

// Optional POST route (for admin to add FAQ)
export async function POST(req: Request) {
  await connectDB();
  try {
    const data = await req.json();
    const { question, answer } = data;

    if (!question || !answer) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const faq = await FAQ.create(data);
    return NextResponse.json(faq, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}
