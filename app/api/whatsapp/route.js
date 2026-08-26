import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req) {
  try {
    const data = await req.formData();
    const incomingMessage = data.get("Body");
    const from = data.get("From");

    console.log("New WhatsApp message:", incomingMessage);

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // ------------ AUTO REPLY MESSAGE ------------
    const reply = await client.messages.create({
      from: process.env.WHATSAPP_NUMBER,
      to: from,
      body: `
Hello 👋

Thanks for contacting *Deepak Khira Enterprises*.

We received your message:
"${incomingMessage}"

💠 Our team will reply shortly.  
💠 For urgent support, call: +91 9109001109  
💠 Email: deepakkhushwah475110@gmail.com

Regards,  
*Deepak Khira Enterprises*
      `,
    });

    // ------------ NOTIFY OWNER ------------
    await client.messages.create({
      from: process.env.WHATSAPP_NUMBER,
      to: process.env.OWNER_WHATSAPP,
      body: `
📩 *New WhatsApp Inquiry Received*

From: ${from}
Message: ${incomingMessage}
      `,
    });

    return NextResponse.json({ success: true, messageId: reply.sid });
  } catch (error) {
    console.error("WhatsApp Error:", error);
    return NextResponse.json({ error: "WhatsApp Auto-Reply Failed" });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
