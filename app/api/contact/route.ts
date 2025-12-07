import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    // 🧪 1. Parse incoming JSON
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          step: "JSON_PARSE_FAILED",
          error: "Invalid JSON format",
          reason:
            "Your frontend is not sending valid JSON. Check fetch request body.",
          fix: "Use JSON.stringify() while sending request.",
        },
        { status: 400 }
      );
    }

    const { name, email, message } = body;

    // 🧪 2. Input Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          step: "VALIDATION_FAILED",
          error: "Required fields missing",
          missingFields: {
            name: !name,
            email: !email,
            message: !message,
          },
          reason: "Some fields are empty.",
          fix: "Make sure name, email, and message fields are filled.",
        },
        { status: 400 }
      );
    }

    // 🧪 3. SMTP ENV CHECK  
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.SMTP_PORT ||
      !process.env.CONTACT_EMAIL
    ) {
      return NextResponse.json(
        {
          success: false,
          step: "ENV_MISSING",
          error: "Missing SMTP environment variables",
          reason: "Your server is missing email configuration.",
          fix: "Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL in .env file.",
        },
        { status: 500 }
      );
    }

    // 🧪 4. Create Transporter
    let transporter;
    try {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } catch (err: any) {
      return NextResponse.json(
        {
          success: false,
          step: "TRANSPORTER_CREATION_FAILED",
          error: err.message,
          reason: "SMTP details are invalid or transporter failed to initialize.",
          fix: "Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.",
        },
        { status: 500 }
      );
    }

    // 🧪 5. Verify SMTP connection
    try {
      await transporter.verify();
    } catch (err: any) {
      return NextResponse.json(
        {
          success: false,
          step: "SMTP_CONNECTION_FAILED",
          error: err.message,
          reason: "Your SMTP server rejected connection.",
          fix: "Verify SMTP credentials, port number, and host.",
        },
        { status: 500 }
      );
    }

    // 🧪 6. Send Email
    let mailInfo;
    try {
      mailInfo = await transporter.sendMail({
        from: `"Website Contact" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL,
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      });
    } catch (err: any) {
      return NextResponse.json(
        {
          success: false,
          step: "EMAIL_SENDING_FAILED",
          error: err.message,
          reason: "SMTP connected but email did NOT send.",
          fix: "Check CONTACT_EMAIL & sender email permissions.",
        },
        { status: 500 }
      );
    }

    // 🟢 SUCCESS RESPONSE
    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully!",
        sentTo: process.env.CONTACT_EMAIL,
        meta: {
          messageId: mailInfo.messageId,
          accepted: mailInfo.accepted,
          rejected: mailInfo.rejected,
          time: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    // 🟥 UNKNOWN SERVER ERROR
    return NextResponse.json(
      {
        success: false,
        step: "UNKNOWN_SERVER_ERROR",
        error: error.message,
        reason: "Unexpected error occurred.",
        fix: "Check server logs.",
        time: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
