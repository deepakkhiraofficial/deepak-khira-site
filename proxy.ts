import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

type AuthTokenPayload = {
  id: string;
  role: "user" | "admin";
  iat?: number;
  exp?: number;
};

const JWT_SECRET = process.env.JWT_SECRET;

// ============================================================
// VERIFY JWT
// ============================================================

function verifyToken(
  token: string
): AuthTokenPayload | null {
  if (!JWT_SECRET) {
    console.error(
      "❌ JWT_SECRET is not configured."
    );

    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as AuthTokenPayload;

    if (!decoded?.id) {
      return null;
    }

    if (
      decoded.role !== "user" &&
      decoded.role !== "admin"
    ) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error(
      "JWT verification failed:",
      error
    );

    return null;
  }
}

// ============================================================
// REDIRECT TO LOGIN
// ============================================================

function redirectToLogin(
  req: NextRequest,
  loginPath: string
) {
  const loginUrl = new URL(
    loginPath,
    req.url
  );

  loginUrl.searchParams.set(
    "redirect",
    req.nextUrl.pathname
  );

  return NextResponse.redirect(
    loginUrl
  );
}

// ============================================================
// PROXY
// ============================================================

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ========================================================
  // ADMIN ROUTES
  // ========================================================

  if (pathname.startsWith("/admin")) {

    // ------------------------------------------------------
    // ADMIN LOGIN IS PUBLIC
    // ------------------------------------------------------

    if (
      pathname === "/admin/login" ||
      pathname === "/admin/login/"
    ) {
      return NextResponse.next();
    }

    // ------------------------------------------------------
    // ADMIN TOKEN
    // ------------------------------------------------------

    const adminToken =
      req.cookies.get(
        "admin-token"
      )?.value;

    if (!adminToken) {
      return redirectToLogin(
        req,
        "/admin/login"
      );
    }

    // ------------------------------------------------------
    // VERIFY ADMIN TOKEN
    // ------------------------------------------------------

    const payload =
      verifyToken(adminToken);

    if (!payload) {
      const response =
        redirectToLogin(
          req,
          "/admin/login"
        );

      response.cookies.set({
        name: "admin-token",
        value: "",
        expires: new Date(0),
        maxAge: 0,
        path: "/",
      });

      return response;
    }

    // ------------------------------------------------------
    // ONLY ADMIN
    // ------------------------------------------------------

    if (
      payload.role !== "admin"
    ) {
      const response =
        NextResponse.redirect(
          new URL(
            "/",
            req.url
          )
        );

      response.cookies.set({
        name: "admin-token",
        value: "",
        expires: new Date(0),
        maxAge: 0,
        path: "/",
      });

      return response;
    }

    return NextResponse.next();
  }

  // ========================================================
  // USER DASHBOARD
  // ========================================================

  if (
    pathname.startsWith(
      "/admin"
    )
  ) {

    // ------------------------------------------------------
    // USER TOKEN
    // ------------------------------------------------------

    const userToken =
      req.cookies.get(
        "auth-token"
      )?.value;

    if (!userToken) {
      return redirectToLogin(
        req,
        "/login"
      );
    }

    // ------------------------------------------------------
    // VERIFY USER TOKEN
    // ------------------------------------------------------

    const payload =
      verifyToken(userToken);

    if (!payload) {
      const response =
        redirectToLogin(
          req,
          "/login"
        );

      response.cookies.set({
        name: "auth-token",
        value: "",
        expires: new Date(0),
        maxAge: 0,
        path: "/",
      });

      return response;
    }

    // ------------------------------------------------------
    // ONLY NORMAL USER
    // ------------------------------------------------------

    if (
      payload.role !== "user"
    ) {
      return NextResponse.redirect(
        new URL(
          "/admin",
          req.url
        )
      );
    }

    return NextResponse.next();
  }

  // ========================================================
  // EVERYTHING ELSE
  // ========================================================

  return NextResponse.next();
}

// ============================================================
// MATCHER
// ============================================================

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};