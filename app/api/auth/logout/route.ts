import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    {
      success: true,
      message: "Logged out successfully.",
    },
    { status: 200 }
  );

  // ========================================================
  // CLEAR NORMAL USER TOKEN
  // ========================================================

  response.cookies.set({
    name: "auth-token",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });

  // ========================================================
  // CLEAR ADMIN TOKEN
  // ========================================================

  response.cookies.set({
    name: "admin-token",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });

  return response;
}