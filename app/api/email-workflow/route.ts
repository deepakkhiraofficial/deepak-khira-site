import { serve } from "@upstash/workflow/nextjs";
import nodemailer from "nodemailer";

export const { POST } = serve(async (context) => {
  const { email, name, message } = context.requestPayload as {
    email: string;
    name: string;
    message: string;
  };

  // Step 1: Wait for 2 minutes
  await context.sleep("delay-2-min", 2 * 60 * 1000);

  // Step 2: Send email after delay
  await context.run("send-auto-reply", async () => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const html = `
      <h2>Auto Reply - Deepak Khira Enterprises</h2>
      <p>Hello <b>${name}</b>, we received your message.</p>
      <p><b>Your Message:</b> ${message}</p>
    `;

    await transporter.sendMail({
      from: `"Deepak Khira Enterprises" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Thank you for contacting us!",
      html,
    });

    console.log("Auto reply sent to", email);
  });
});
