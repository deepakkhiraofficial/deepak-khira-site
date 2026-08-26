import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";

async function createAdmin() {
  const MONGO_URI = process.env.MONGO_URI;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const ADMIN_NAME =
    process.env.ADMIN_NAME || "Administrator";

  if (!MONGO_URI) {
    throw new Error(
      "MONGO_URI is not configured in .env.local"
    );
  }

  if (!ADMIN_EMAIL) {
    throw new Error(
      "ADMIN_EMAIL is not configured in .env.local"
    );
  }

  if (!ADMIN_PASSWORD) {
    throw new Error(
      "ADMIN_PASSWORD is not configured in .env.local"
    );
  }

  if (ADMIN_PASSWORD.length < 8) {
    throw new Error(
      "ADMIN_PASSWORD must be at least 8 characters."
    );
  }

  const email = ADMIN_EMAIL
    .trim()
    .toLowerCase();

  await mongoose.connect(MONGO_URI);

  console.log("MongoDB connected.");

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    if (existingUser.role === "admin") {
      console.log(
        `Admin already exists: ${email}`
      );
    } else {
      existingUser.role = "admin";

      await existingUser.save();

      console.log(
        `Existing user promoted to admin: ${email}`
      );
    }

    await mongoose.disconnect();
    return;
  }

  const hashedPassword =
    await bcrypt.hash(
      ADMIN_PASSWORD,
      12
    );

  await User.create({
    name: ADMIN_NAME.trim(),
    email,
    password: hashedPassword,
    role: "admin",
  });

  console.log(
    `Admin created successfully: ${email}`
  );

  await mongoose.disconnect();
}

createAdmin().catch(
  async (error) => {
    console.error(
      "ADMIN CREATION FAILED:",
      error
    );

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  }
);