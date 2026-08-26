import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";

const JWT_COOKIE = "token"; // adjust if different

export async function getUserIdFromReq(req) {
  try {
    const token = req.cookies.get(JWT_COOKIE)?.value;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.id || payload._id || null;
  } catch (e) {
    return null;
  }
}

export async function ensureDb() {
  await connectDB();
}
