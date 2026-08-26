import { Client } from "@upstash/qstash";
import { NextResponse } from "next/server";

const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export async function POST(req: Request) {
  const body = await req.json();

  // Trigger QStash workflow URL
  await qstash.publishJSON({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/email-workflow`,
    body,
  });

  return NextResponse.json({ success: true, message: "Queued Successfully" });
}
