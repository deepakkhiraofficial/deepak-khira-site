// lib/queue.ts
import { Queue } from "bullmq";
import { redis } from "./redis";

export const emailQueue = new Queue("auto-email-queue", {
  connection: redis,
});
