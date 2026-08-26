import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req) {
  try {
    // ============================================================
    // READ WHATSAPP WEBHOOK DATA
    // ============================================================

    const data = await req.formData();

    const incomingMessage = data.get("Body");
    const from = data.get("From");

    console.log("New WhatsApp message:", incomingMessage);
    console.log("WhatsApp sender:", from);

    // ============================================================
    // VALIDATE ENVIRONMENT VARIABLES
    // ============================================================

    const {
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN,
      WHATSAPP_NUMBER,
      OWNER_WHATSAPP,
    } = process.env;

    if (
      !TWILIO_ACCOUNT_SID ||
      !TWILIO_AUTH_TOKEN ||
      !WHATSAPP_NUMBER ||
      !OWNER_WHATSAPP
    ) {
      console.error(
        "WhatsApp configuration is missing. Check Twilio environment variables."
      );

      return NextResponse.json(
        {
          success: false,
          error: "WhatsApp service is not configured.",
        },
        { status: 500 }
      );
    }

    // ============================================================
    // VALIDATE INCOMING MESSAGE
    // ============================================================

    if (!from || !incomingMessage) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid WhatsApp webhook data.",
        },
        { status: 400 }
      );
    }

    // ============================================================
    // TWILIO CLIENT
    // ============================================================

    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    // ============================================================
    // AUTO REPLY TO CUSTOMER
    // ============================================================

    const reply = await client.messages.create({
      from: WHATSAPP_NUMBER,
      to: from,
      body: `Hello 👋

Thanks for contacting *Deepak Khira Enterprises*.

We received your message:

"${incomingMessage}"

💠 Our team will reply shortly.
💠 For urgent support, call: +91 9109001109
💠 Email: deepakkhushwah475110@gmail.com

Regards,
*Deepak Khira Enterprises*`,
    });

    // ============================================================
    // NOTIFY OWNER
    // ============================================================

    await client.messages.create({
      from: WHATSAPP_NUMBER,
      to: OWNER_WHATSAPP,
      body: `📩 *New WhatsApp Inquiry Received*

From: ${from}

Message:
${incomingMessage}`,
    });

    // ============================================================
    // SUCCESS RESPONSE
    // ============================================================

    return NextResponse.json({
      success: true,
      message: "WhatsApp message processed successfully.",
      messageId: reply.sid,
    });
  } catch (error) {
    console.error("WhatsApp Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "WhatsApp Auto-Reply Failed",
      },
      { status: 500 }
    );
  }
}
