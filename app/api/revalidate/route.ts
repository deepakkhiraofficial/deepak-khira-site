import { NextResponse } from "next/server";

export async function GET() {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate-path`, { cache: "no-cache" });
    return NextResponse.json({ revalidated: true });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
