// models/Application.ts
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    jobTitle: { type: String, required: true },
    message: { type: String },
    resume: { type: String }, // Path to uploaded resume
  },
  { timestamps: true }
);

const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
export default Application;
