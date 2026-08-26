import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Deepak Khira Enterprises" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "We received your message ✔",
      html: `
        <h2>Thank You for Contacting Deepak Khira Enterprises</h2>
        <p>Hello <b>${name}</b>,</p>
        <p>Your message is received. Our team will contact you soon.</p>
        <p><b>Your Message:</b> ${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, msg: err.message }, { status: 500 });
  }
}
