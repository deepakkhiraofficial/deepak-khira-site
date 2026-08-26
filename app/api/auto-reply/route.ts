import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    // =========================================================
    // GET REQUEST DATA
    // =========================================================

    const { name, email, message } = await req.json();

    // =========================================================
    // VALIDATION
    // =========================================================

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          msg: "Name, email and message are required.",
        },
        { status: 400 }
      );
    }

    // =========================================================
    // SMTP CONFIGURATION
    // =========================================================

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error("SMTP configuration is missing.");

      return NextResponse.json(
        {
          success: false,
          msg: "Email service is not configured.",
        },
        { status: 500 }
      );
    }

    // =========================================================
    // CREATE TRANSPORTER
    // =========================================================

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // =========================================================
    // SEND AUTO REPLY
    // =========================================================

    await transporter.sendMail({
      from: `"Deepak Khira Enterprises" <${smtpUser}>`,
      to: email,
      subject: "We received your message ✔",

      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Message Received</title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background-color: #f8fafc;
              font-family: Arial, Helvetica, sans-serif;
            "
          >
            <div
              style="
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 12px;
                padding: 32px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
              "
            >
              <h2 style="color: #0f172a; margin-bottom: 20px;">
                Thank You for Contacting Deepak Khira Enterprises
              </h2>

              <p style="color: #334155;">
                Hello <strong>${name}</strong>,
              </p>

              <p style="color: #334155; line-height: 1.6;">
                We have successfully received your message.
                Our team will review it and contact you soon.
              </p>

              <div
                style="
                  margin: 24px 0;
                  padding: 16px;
                  background: #f1f5f9;
                  border-radius: 8px;
                "
              >
                <strong style="color: #0f172a;">
                  Your Message:
                </strong>

                <p
                  style="
                    color: #475569;
                    line-height: 1.6;
                    margin-bottom: 0;
                  "
                >
                  ${message}
                </p>
              </div>

              <p
                style="
                  color: #64748b;
                  font-size: 14px;
                  margin-top: 30px;
                "
              >
                Regards,<br />
                <strong>Deepak Khira Enterprises</strong>
              </p>
            </div>
          </body>
        </html>
      `,
    });

    // =========================================================
    // SUCCESS
    // =========================================================

    return NextResponse.json(
      {
        success: true,
        msg: "Auto-reply email sent successfully.",
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    // =========================================================
    // ERROR HANDLING
    // =========================================================

    console.error("AUTO REPLY ERROR:", err);

    const message =
      err instanceof Error
        ? err.message
        : "Unable to send auto-reply email.";

    return NextResponse.json(
      {
        success: false,
        msg: message,
      },
      { status: 500 }
    );
  }
}