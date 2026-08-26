import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

// ============================================================
// TYPES
// ============================================================

interface AdminTokenPayload {
    id: string;
    role: "user" | "admin";
    iat?: number;
    exp?: number;
}

// ============================================================
// GET ADMIN PROFILE
// ============================================================

export async function GET() {
    try {
        // ========================================================
        // JWT SECRET
        // ========================================================

        const JWT_SECRET =
            process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            console.error(
                "ADMIN ME ERROR: JWT_SECRET is missing."
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Server authentication configuration error.",
                },
                {
                    status: 500,
                }
            );
        }

        // ========================================================
        // GET ADMIN COOKIE
        // ========================================================

        const cookieStore =
            await cookies();

        const adminToken =
            cookieStore.get(
                "admin-token"
            )?.value;

        // ========================================================
        // TOKEN NOT FOUND
        // ========================================================

        if (!adminToken) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Admin session expired. Please login again.",
                },
                {
                    status: 401,
                }
            );
        }

        // ========================================================
        // VERIFY JWT
        // ========================================================

        let decoded:
            AdminTokenPayload;

        try {
            decoded =
                jwt.verify(
                    adminToken,
                    JWT_SECRET
                ) as AdminTokenPayload;
        } catch (error) {
            console.error(
                "ADMIN JWT VERIFICATION FAILED:",
                error instanceof Error
                    ? error.message
                    : error
            );

            // ----------------------------------------------------
            // CLEAR INVALID COOKIE
            // ----------------------------------------------------

            const response =
                NextResponse.json(
                    {
                        success: false,
                        message:
                            "Admin session expired. Please login again.",
                    },
                    {
                        status: 401,
                    }
                );

            response.cookies.set({
                name: "admin-token",
                value: "",
                expires: new Date(0),
                maxAge: 0,
                httpOnly: true,
                secure:
                    process.env.NODE_ENV ===
                    "production",
                sameSite: "lax",
                path: "/",
            });

            return response;
        }

        // ========================================================
        // VALIDATE JWT PAYLOAD
        // ========================================================

        if (!decoded?.id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid admin session.",
                },
                {
                    status: 401,
                }
            );
        }

        // ========================================================
        // ADMIN ROLE CHECK
        // ========================================================

        if (
            decoded.role !== "admin"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Admin authorization required.",
                },
                {
                    status: 403,
                }
            );
        }

        // ========================================================
        // DATABASE CONNECTION
        // ========================================================

        await connectDB();

        // ========================================================
        // FIND ADMIN
        // ========================================================

        const admin =
            await User.findById(
                decoded.id
            )
                .select(
                    "_id name email role createdAt updatedAt"
                )
                .lean();

        // ========================================================
        // ADMIN NOT FOUND
        // ========================================================

        if (!admin) {
            const response =
                NextResponse.json(
                    {
                        success: false,
                        message:
                            "Admin account not found.",
                    },
                    {
                        status: 404,
                    }
                );

            // ----------------------------------------------------
            // REMOVE INVALID SESSION
            // ----------------------------------------------------

            response.cookies.set({
                name: "admin-token",
                value: "",
                expires: new Date(0),
                maxAge: 0,
                httpOnly: true,
                secure:
                    process.env.NODE_ENV ===
                    "production",
                sameSite: "lax",
                path: "/",
            });

            return response;
        }

        // ========================================================
        // DATABASE ROLE CHECK
        // ========================================================

        if (admin.role !== "admin") {
            const response =
                NextResponse.json(
                    {
                        success: false,
                        message:
                            "Admin authorization required.",
                    },
                    {
                        status: 403,
                    }
                );

            // ----------------------------------------------------
            // REMOVE INVALID SESSION
            // ----------------------------------------------------

            response.cookies.set({
                name: "admin-token",
                value: "",
                expires: new Date(0),
                maxAge: 0,
                httpOnly: true,
                secure:
                    process.env.NODE_ENV ===
                    "production",
                sameSite: "lax",
                path: "/",
            });

            return response;
        }

        // ========================================================
        // SUCCESS
        // ========================================================

        return NextResponse.json(
            {
                success: true,

                user: {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                    createdAt:
                        admin.createdAt,
                    updatedAt:
                        admin.updatedAt,
                },
            },
            {
                status: 200,

                headers: {
                    "Cache-Control":
                        "no-store, max-age=0",
                },
            }
        );
    } catch (error) {
        // ========================================================
        // GLOBAL ERROR
        // ========================================================

        console.error(
            "ADMIN PROFILE API ERROR:",
            error instanceof Error
                ? error.stack
                : error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to load admin profile.",
            },
            {
                status: 500,
            }
        );
    }
}