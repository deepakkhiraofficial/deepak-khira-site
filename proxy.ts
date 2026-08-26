import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type AuthTokenPayload = {
  id: string;
  role: "user" | "admin";
  iat?: number;
  exp?: number;
};

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * ============================================================
 * BASE64URL → ARRAYBUFFER
 * ============================================================
 */
function base64UrlToArrayBuffer(
  base64Url: string
): ArrayBuffer {
  const base64 = base64Url
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padded =
    base64 +
    "=".repeat(
      (4 - (base64.length % 4)) % 4
    );

  const binary = atob(padded);

  const bytes = new Uint8Array(
    binary.length
  );

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  /**
   * Create a guaranteed standalone ArrayBuffer.
   *
   * This avoids TypeScript's ArrayBufferLike /
   * SharedArrayBuffer compatibility issue.
   */
  const buffer = new ArrayBuffer(
    bytes.byteLength
  );

  new Uint8Array(buffer).set(bytes);

  return buffer;
}

/**
 * ============================================================
 * DECODE JWT PAYLOAD
 * ============================================================
 */
function decodePayload(
  token: string
): AuthTokenPayload | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payloadBuffer =
      base64UrlToArrayBuffer(parts[1]);

    const payloadText =
      new TextDecoder().decode(
        payloadBuffer
      );

    const payload =
      JSON.parse(
        payloadText
      ) as AuthTokenPayload;

    /**
     * Validate ID
     */
    if (
      !payload ||
      typeof payload.id !== "string" ||
      !payload.id
    ) {
      return null;
    }

    /**
     * Validate role
     */
    if (
      payload.role !== "user" &&
      payload.role !== "admin"
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * ============================================================
 * VERIFY JWT
 *
 * HS256 verification using Web Crypto API.
 *
 * This is compatible with Next.js Proxy / Edge runtime
 * and avoids jsonwebtoken dependency inside proxy.ts.
 * ============================================================
 */
async function verifyToken(
  token: string
): Promise<AuthTokenPayload | null> {
  /**
   * JWT secret must exist.
   */
  if (!JWT_SECRET) {
    console.error(
      "JWT_SECRET is not configured."
    );

    return null;
  }

  try {
    const parts = token.split(".");

    /**
     * JWT must have:
     *
     * header.payload.signature
     */
    if (parts.length !== 3) {
      return null;
    }

    const [
      encodedHeader,
      encodedPayload,
      encodedSignature,
    ] = parts;

    /**
     * ========================================================
     * DECODE HEADER
     * ========================================================
     */
    const headerBuffer =
      base64UrlToArrayBuffer(
        encodedHeader
      );

    const headerText =
      new TextDecoder().decode(
        headerBuffer
      );

    const header =
      JSON.parse(headerText) as {
        alg?: string;
        typ?: string;
      };

    /**
     * Only allow HS256.
     */
    if (header.alg !== "HS256") {
      console.error(
        "Unsupported JWT algorithm:",
        header.alg
      );

      return null;
    }

    /**
     * ========================================================
     * IMPORT SECRET
     * ========================================================
     */
    const secretBytes =
      new TextEncoder().encode(
        JWT_SECRET
      );

    /**
     * Convert Uint8Array into a guaranteed
     * standalone ArrayBuffer.
     */
    const secretBuffer =
      new ArrayBuffer(
        secretBytes.byteLength
      );

    new Uint8Array(secretBuffer).set(
      secretBytes
    );

    const secretKey =
      await crypto.subtle.importKey(
        "raw",
        secretBuffer,
        {
          name: "HMAC",
          hash: "SHA-256",
        },
        false,
        ["verify"]
      );

    /**
     * ========================================================
     * SIGNATURE
     * ========================================================
     */
    const signatureBuffer =
      base64UrlToArrayBuffer(
        encodedSignature
      );

    /**
     * ========================================================
     * SIGNED DATA
     * ========================================================
     */
    const signedDataBytes =
      new TextEncoder().encode(
        `${encodedHeader}.${encodedPayload}`
      );

    /**
     * Again create a guaranteed ArrayBuffer.
     */
    const signedDataBuffer =
      new ArrayBuffer(
        signedDataBytes.byteLength
      );

    new Uint8Array(
      signedDataBuffer
    ).set(signedDataBytes);

    /**
     * ========================================================
     * VERIFY SIGNATURE
     * ========================================================
     */
    const valid =
      await crypto.subtle.verify(
        "HMAC",
        secretKey,
        signatureBuffer,
        signedDataBuffer
      );

    if (!valid) {
      return null;
    }

    /**
     * ========================================================
     * DECODE PAYLOAD
     * ========================================================
     */
    const payload =
      decodePayload(token);

    if (!payload) {
      return null;
    }

    /**
     * ========================================================
     * CHECK EXPIRATION
     * ========================================================
     */
    if (
      typeof payload.exp === "number" &&
      payload.exp * 1000 <= Date.now()
    ) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error(
      "JWT verification failed:",
      error instanceof Error
        ? error.message
        : error
    );

    return null;
  }
}

/**
 * ============================================================
 * REDIRECT TO LOGIN
 * ============================================================
 */
function redirectToLogin(
  req: NextRequest,
  loginPath: string
) {
  const loginUrl = new URL(
    loginPath,
    req.url
  );

  /**
   * Preserve the original page.
   *
   * Example:
   *
   * /dashboard/orders
   *
   * becomes:
   *
   * /login?redirect=/dashboard/orders
   */
  loginUrl.searchParams.set(
    "redirect",
    req.nextUrl.pathname
  );

  return NextResponse.redirect(
    loginUrl
  );
}

/**
 * ============================================================
 * CLEAR AUTH COOKIE
 * ============================================================
 */
function clearCookie(
  response: NextResponse,
  cookieName: string
) {
  response.cookies.set({
    name: cookieName,
    value: "",
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
    sameSite: "strict",
    secure:
      process.env.NODE_ENV ===
      "production",
    path: "/",
  });
}

/**
 * ============================================================
 * PROXY
 * ============================================================
 */
export async function proxy(
  req: NextRequest
) {
  const { pathname } =
    req.nextUrl;

  /**
   * ==========================================================
   * ADMIN ROUTES
   * ==========================================================
   */
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  ) {
    /**
     * --------------------------------------------------------
     * ADMIN LOGIN IS PUBLIC
     * --------------------------------------------------------
     */
    if (
      pathname === "/admin/login" ||
      pathname === "/admin/login/"
    ) {
      return NextResponse.next();
    }

    /**
     * --------------------------------------------------------
     * GET ADMIN TOKEN
     * --------------------------------------------------------
     */
    const adminToken =
      req.cookies.get(
        "admin-token"
      )?.value;

    /**
     * --------------------------------------------------------
     * NO ADMIN TOKEN
     * --------------------------------------------------------
     */
    if (!adminToken) {
      return redirectToLogin(
        req,
        "/admin/login"
      );
    }

    /**
     * --------------------------------------------------------
     * VERIFY ADMIN TOKEN
     * --------------------------------------------------------
     */
    const payload =
      await verifyToken(
        adminToken
      );

    /**
     * --------------------------------------------------------
     * INVALID TOKEN
     * --------------------------------------------------------
     */
    if (!payload) {
      const response =
        redirectToLogin(
          req,
          "/admin/login"
        );

      clearCookie(
        response,
        "admin-token"
      );

      return response;
    }

    /**
     * --------------------------------------------------------
     * ONLY ADMIN
     * --------------------------------------------------------
     */
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

      clearCookie(
        response,
        "admin-token"
      );

      return response;
    }

    /**
     * --------------------------------------------------------
     * ADMIN AUTHORIZED
     * --------------------------------------------------------
     */
    return NextResponse.next();
  }

  /**
   * ==========================================================
   * USER DASHBOARD
   * ==========================================================
   */
  if (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/")
  ) {
    /**
     * --------------------------------------------------------
     * GET USER TOKEN
     * --------------------------------------------------------
     */
    const userToken =
      req.cookies.get(
        "auth-token"
      )?.value;

    /**
     * --------------------------------------------------------
     * NO USER TOKEN
     * --------------------------------------------------------
     */
    if (!userToken) {
      return redirectToLogin(
        req,
        "/login"
      );
    }

    /**
     * --------------------------------------------------------
     * VERIFY USER TOKEN
     * --------------------------------------------------------
     */
    const payload =
      await verifyToken(
        userToken
      );

    /**
     * --------------------------------------------------------
     * INVALID USER TOKEN
     * --------------------------------------------------------
     */
    if (!payload) {
      const response =
        redirectToLogin(
          req,
          "/login"
        );

      clearCookie(
        response,
        "auth-token"
      );

      return response;
    }

    /**
     * --------------------------------------------------------
     * ADMIN CANNOT USE USER DASHBOARD
     * --------------------------------------------------------
     */
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

    /**
     * --------------------------------------------------------
     * USER AUTHORIZED
     * --------------------------------------------------------
     */
    return NextResponse.next();
  }

  /**
   * ==========================================================
   * PUBLIC ROUTES
   * ==========================================================
   */
  return NextResponse.next();
}

/**
 * ============================================================
 * MATCHER
 * ============================================================
 */
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};