// /app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type Body = { name: string; email: string; message: string };

/* ===========================
   SUPER PROFESSIONAL OWNER MAIL
=========================== */
const createOwnerHtml = (name: string, email: string, message: string) => `
  <div style="font-family:Inter,Arial,sans-serif;color:#0f172a;padding:28px;max-width:780px;margin:auto;background:#ffffff;border-radius:14px;box-shadow:0 5px 20px rgba(0,0,0,0.10);">

    <h2 style="margin-bottom:14px;color:#0b5394;font-size:22px;font-weight:700;">
      📬 New Contact Form Submission
    </h2>

    <div style="font-size:15px;margin-bottom:20px;">
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    </div>

    <div style="padding:18px;background:#f1f5f9;border-radius:12px;border-left:5px solid #1e88e5;">
      <strong style="color:#1e88e5;font-size:15px;">Message</strong>
      <p style="margin-top:8px;line-height:1.7;font-size:15px;color:#334155;">
        ${escapeHtml(message).replace(/\n/g, '<br/>')}
      </p>
    </div>

    <hr style="margin:22px 0;border:none;border-top:1px solid #e2e8f0"/>

    <p style="color:#64748b;font-size:13px;">Received on: <strong>${new Date().toLocaleString()}</strong></p>

    <p style="margin-top:10px;color:#94a3b8;font-size:12px;text-align:center;">
      Auto-generated email from your website contact form.
    </p>
  </div>
`;

/* ===========================
 SUPER PREMIUM AUTO-REPLY
=========================== */
const createAutoReplyHtml = (name: string, message: string) => `
  <div style="font-family:Inter,Arial,sans-serif;color:#0f172a;padding:28px;max-width:760px;margin:auto;background:#ffffff;border-radius:16px;box-shadow:0 6px 22px rgba(0,0,0,0.10);">

    <!-- Header -->
    <div style="text-align:center;padding:28px 0;border-radius:12px;
      background:linear-gradient(135deg,#0b5394,#1e88e5,#64b5f6);color:#fff;">
      <img 
        src="https://res.cloudinary.com/dy5s3zplq/image/upload/v1765540082/mkiavgnlcnfqzvfglyne.png"
        width="120"
        style="border-radius:30px;display:block;margin:0 auto 12px;"
      />
      <h1 style="margin:0;font-size:24px;font-weight:700;">Thank You for Reaching Out</h1>
      <p style="margin-top:6px;font-size:14px;opacity:0.9;">Deepak Khira Enterprises</p>
    </div>

    <!-- Greeting -->
    <div style="padding:26px;">
      <p style="font-size:16px;margin:0;color:#334155;">
        Hello <strong>${escapeHtml(name)}</strong>,
      </p>

      <p style="margin-top:10px;color:#334155;line-height:1.7;font-size:15px;">
        We have received your message successfully.  
        Our support team will respond within <strong>12–24 hours</strong>.  
        Thank you for choosing <strong>Deepak Khira Enterprises</strong>.
      </p>

      <!-- Message Card -->
      <div style="margin-top:18px;padding:18px;background:#f8fafc;border-left:5px solid #0b5394;border-radius:12px;">
        <strong style="color:#0b5394;font-size:15px;">Your Message</strong>
        <p style="margin-top:8px;line-height:1.7;font-size:14px;color:#1e293b;">
          ${escapeHtml(message).replace(/\n/g, '<br/>')}
        </p>
      </div>

      <!-- Contact Info -->
      <div style="margin-top:20px;font-size:15px;color:#475569;line-height:1.7;">
        <p>
          For urgent support, call:
          <a href="tel:9109001109" style="color:#0b5394;font-weight:600;text-decoration:none;">
            +91 91090 01109
          </a>
        </p>
      </div>

      <!-- Social Links -->
      <div style="margin-top:26px;text-align:center;">
        <a href="https://wa.me/919244201109" style="margin:0 8px;color:#0b5394;font-size:14px;">WhatsApp</a>
        <a href="https://instagram.com/deepakkhiraofficial/" style="margin:0 8px;color:#0b5394;font-size:14px;">Instagram</a>
        <a href="https://facebook.com/deepakkhiraofficial/" style="margin:0 8px;color:#0b5394;font-size:14px;">Facebook</a>
      </div>

      <!-- Footer -->
      <p style="margin-top:30px;font-size:12px;color:#94a3b8;text-align:center;">
        This is an automated confirmation email. Please do not reply.
      </p>

      <p style="font-size:12px;color:#cbd5e1;text-align:center;margin-top:8px;">
        © ${new Date().getFullYear()} Deepak Khira Enterprises — All Rights Reserved.
      </p>
    </div>
  </div>
`;

/* ===========================
 HTML ESCAPE
=========================== */
function escapeHtml(str: string) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ===========================
 MAIN POST ROUTE
=========================== */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const { name, email, message } = body || {};

    if (!name || name.trim().length < 2)
      return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });

    if (!message || message.trim().length < 5)
      return NextResponse.json({ error: "Message is too short." }, { status: 400 });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send to owner
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `New message from ${name}`,
      html: createOwnerHtml(name, email, message),
    });

    // Auto-reply
    await transporter.sendMail({
      from: `"Deepak Khira Enterprises" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Thank You for Contacting Us",
      html: createAutoReplyHtml(name, message),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Server error. Try again later." }, { status: 500 });
  }
}
