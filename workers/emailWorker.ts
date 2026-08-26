import "dotenv/config";
import { Worker } from "bullmq";
import nodemailer from "nodemailer";
import { redis } from "../lib/redis";


const worker = new Worker(
  "auto-email-queue",
  async (job) => {
    const { name, email, message } = job.data;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const html = `
      <h2>Auto Reply from Deepak Khira Enterprises</h2>
      <p>Hello <b>${name}</b>,</p>
      <p>We received your message. Our team will reply shortly.</p>
      <p><b>Your Message:</b> ${message}</p>
    `;

    await transporter.sendMail({
      from: `"Deepak Khira Enterprises" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "We received your message ✔",
      html
    });

    console.log("Auto reply sent →", email);
  },
  {
    connection: {
      ...redis.options,
      maxRetriesPerRequest: null,
      enableReadyCheck: false
    }
  }
);

console.log("Email worker initialized & waiting for jobs...");
export default worker;