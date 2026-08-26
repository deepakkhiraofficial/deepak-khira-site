import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export type AuthUser = {
  id: string;
  role: "user" | "admin";
};

type JwtPayload = {
  id: string;
  role: "user" | "admin";
  iat?: number;
  exp?: number;
};

// ============================================================
// GET AUTH USER
// ============================================================

export async function getAuthUser(
  cookieName: "auth-token" | "admin-token" = "auth-token"
): Promise<AuthUser | null> {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    console.error(
      "JWT_SECRET is not configured."
    );

    return null;
  }

  try {
    const cookieStore = await cookies();

    const token =
      cookieStore.get(cookieName)?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as JwtPayload;

    // --------------------------------------------------------
    // Validate JWT payload
    // --------------------------------------------------------

    if (
      !decoded.id ||
      !decoded.role
    ) {
      return null;
    }

    if (
      decoded.role !== "user" &&
      decoded.role !== "admin"
    ) {
      return null;
    }

    return {
      id: decoded.id,
      role: decoded.role,
    };
  } catch (error) {
    console.error(
      "AUTH TOKEN VERIFICATION FAILED"
    );

    return null;
  }
}

// ============================================================
// REQUIRE USER
// ============================================================

export async function requireUser() {
  const user = await getAuthUser(
    "auth-token"
  );

  if (!user || user.role !== "user") {
    return null;
  }

  return user;
}

// ============================================================
// REQUIRE ADMIN
// ============================================================

export async function requireAdmin() {
  const admin = await getAuthUser(
    "admin-token"
  );

  if (
    !admin ||
    admin.role !== "admin"
  ) {
    return null;
  }

  return admin;
}