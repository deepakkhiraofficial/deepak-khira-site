// app/api/applications/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import connectDB from "@/lib/mongodb";
import Application from "@/models/Application"; // Your Mongoose model

export const runtime = "nodejs"; // Node runtime required for file handling

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const phone = formData.get("phone")?.toString().trim() || "";
    const jobTitle = formData.get("jobTitle")?.toString().trim() || "";
    const message = formData.get("message")?.toString().trim() || "";
    const resumeFile = formData.get("resume") as File | null;

    // ----------- VALIDATION ----------- //
    if (!name || !email || !jobTitle) {
      return NextResponse.json(
        { error: "Name, email, and job title are required." },
        { status: 400 }
      );
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    // Resume validation
    let resumePath = null;
    if (resumeFile) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(resumeFile.type)) {
        return NextResponse.json(
          { error: "Only PDF/DOC/DOCX files are allowed." },
          { status: 400 }
        );
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (resumeFile.size > maxSize) {
        return NextResponse.json(
          { error: "Resume must be less than 5MB." },
          { status: 400 }
        );
      }

      // Save file to /uploads
      const uploadsDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      const filePath = path.join(uploadsDir, `${Date.now()}_${resumeFile.name}`);
      fs.writeFileSync(filePath, buffer);

      resumePath = filePath;
    }

    // ----------- SAVE TO DB ----------- //
    await connectDB(); // MongoDB connection
    const application = await Application.create({
      name,
      email,
      phone,
      jobTitle,
      message,
      resume: resumePath,
    });

    return NextResponse.json({ success: true, application });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit application." }, { status: 500 });
  }
}
