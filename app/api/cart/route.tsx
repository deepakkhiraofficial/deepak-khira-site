import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Cart API is available.",
  });
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Cart is currently managed on the client side.",
    },
    { status: 501 }
  );
}
