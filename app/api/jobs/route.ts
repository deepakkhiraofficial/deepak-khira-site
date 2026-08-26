import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const jobs = await Job.find().sort({ createdAt: -1 });
  return NextResponse.json(jobs);
}
