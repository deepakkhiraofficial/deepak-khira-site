import { NextResponse } from "next/server";
import mongoose from "mongoose";
import {
    PDFDocument,
    StandardFonts,
    rgb,
} from "pdf-lib";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// ============================================================
// HELPERS
// ============================================================

function money(value: unknown) {
    const amount = Number(value || 0);

    return `Rs. ${amount.toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;
}

function safeText(value: unknown) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value);
}

function formatDate(value: unknown) {
    if (!value) return "N/A";

    const date = new Date(
        String(value)
    );

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
}

function formatDateTime(value: unknown) {
    if (!value) return "N/A";

    const date = new Date(
        String(value)
    );

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
}

function truncate(
    text: string,
    max: number
) {
    if (text.length <= max) {
        return text;
    }

    return `${text.slice(
        0,
        max - 3
    )}...`;
}

// ============================================================
// PDF DRAW HELPERS
// ============================================================

function drawText(
    page: any,
    text: string,
    x: number,
    y: number,
    options: {
        font: any;
        size?: number;
        color?: any;
        maxWidth?: number;
    }
) {
    const size = options.size || 9;

    page.drawText(
        truncate(text, 100),
        {
            x,
            y,
            size,
            font: options.font,
            color:
                options.color ||
                rgb(0.15, 0.17, 0.20),
            maxWidth:
                options.maxWidth,
        }
    );
}

function drawLine(
    page: any,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color = rgb(
        0.88,
        0.89,
        0.91
    ),
    thickness = 1
) {
    page.drawLine({
        start: {
            x: x1,
            y: y1,
        },
        end: {
            x: x2,
            y: y2,
        },
        color,
        thickness,
    });
}

function drawBox(
    page: any,
    x: number,
    y: number,
    width: number,
    height: number,
    color = rgb(
        0.97,
        0.97,
        0.98
    ),
    borderColor = rgb(
        0.88,
        0.89,
        0.91
    )
) {
    page.drawRectangle({
        x,
        y,
        width,
        height,
        color,
        borderColor,
        borderWidth: 1,
    });
}

// ============================================================
// GET PDF INVOICE
// ============================================================

export async function GET(
    request: Request,
    {
        params,
    }: {
        params: Promise<{
            id: string;
        }>;
    }
) {
    try {
        // ========================================================
        // ADMIN AUTHORIZATION
        // ========================================================

        const admin =
            await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Admin authorization required.",
                },
                {
                    status: 401,
                }
            );
        }

        // ========================================================
        // PARAMS
        // ========================================================

        const { id } = await params;

        if (
            !mongoose.Types.ObjectId.isValid(
                id
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid order ID.",
                },
                {
                    status: 400,
                }
            );
        }

        // ========================================================
        // DATABASE
        // ========================================================

        await connectDB();

        // ========================================================
        // ORDER
        // ========================================================

        const order =
            await Order.findById(id)
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "items.product",
                    "name slug images price"
                )
                .populate(
                    "statusHistory.changedBy",
                    "name email"
                )
                .lean();

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Order not found.",
                },
                {
                    status: 404,
                }
            );
        }

        // ========================================================
        // PDF DOCUMENT
        // ========================================================

        const pdfDoc =
            await PDFDocument.create();

        const regularFont =
            await pdfDoc.embedFont(
                StandardFonts.Helvetica
            );

        const boldFont =
            await pdfDoc.embedFont(
                StandardFonts.HelveticaBold
            );

        const pageWidth = 595.28;
        const pageHeight = 841.89;

        const margin = 42;

        let page =
            pdfDoc.addPage([
                pageWidth,
                pageHeight,
            ]);

        let y =
            pageHeight - margin;

        // ========================================================
        // COLORS
        // ========================================================

        const dark =
            rgb(
                0.08,
                0.10,
                0.13
            );

        const muted =
            rgb(
                0.38,
                0.40,
                0.44
            );

        const primary =
            rgb(
                0.08,
                0.28,
                0.62
            );

        const lightBlue =
            rgb(
                0.94,
                0.97,
                1
            );

        const green =
            rgb(
                0.08,
                0.48,
                0.25
            );

        const red =
            rgb(
                0.72,
                0.12,
                0.12
            );

        // ========================================================
        // HEADER
        // ========================================================

        drawText(
            page,
            "DEEPAK KHIRA",
            margin,
            y,
            {
                font: boldFont,
                size: 22,
                color: dark,
            }
        );

        drawText(
            page,
            "ENTERPRISES",
            margin,
            y - 22,
            {
                font: boldFont,
                size: 11,
                color: primary,
            }
        );

        drawText(
            page,
            "E-commerce & Retail",
            margin,
            y - 37,
            {
                font: regularFont,
                size: 8,
                color: muted,
            }
        );

        // Right side invoice title

        drawText(
            page,
            "TAX INVOICE",
            405,
            y - 2,
            {
                font: boldFont,
                size: 18,
                color: dark,
            }
        );

        drawText(
            page,
            `Invoice No: INV-${String(
                order._id
            )
                .slice(-8)
                .toUpperCase()}`,
            405,
            y - 23,
            {
                font: regularFont,
                size: 8,
                color: muted,
            }
        );

        drawText(
            page,
            `Order ID: ${safeText(
                order._id
            )}`,
            405,
            y - 37,
            {
                font: regularFont,
                size: 8,
                color: muted,
            }
        );

        drawText(
            page,
            `Order Date: ${formatDate(
                order.createdAt
            )}`,
            405,
            y - 51,
            {
                font: regularFont,
                size: 8,
                color: muted,
            }
        );

        drawLine(
            page,
            margin,
            y - 63,
            pageWidth - margin,
            y - 63,
            primary,
            1.5
        );

        y -= 90;

        // ========================================================
        // CUSTOMER + SHIPPING
        // ========================================================

        const cardWidth =
            (pageWidth -
                margin * 2 -
                15) /
            2;

        const cardHeight = 118;

        drawBox(
            page,
            margin,
            y - cardHeight,
            cardWidth,
            cardHeight,
            rgb(
                0.98,
                0.98,
                0.99
            )
        );

        drawBox(
            page,
            margin +
                cardWidth +
                15,
            y - cardHeight,
            cardWidth,
            cardHeight,
            rgb(
                0.98,
                0.98,
                0.99
            )
        );

        drawText(
            page,
            "BILL TO",
            margin + 12,
            y - 20,
            {
                font: boldFont,
                size: 9,
                color: primary,
            }
        );

        const customerName =
            order.user?.name ||
            order.shippingAddress
                ?.fullName ||
            "N/A";

        const customerEmail =
            order.user?.email ||
            "N/A";

        const customerPhone =
            order.shippingAddress
                ?.phone ||
            "N/A";

        drawText(
            page,
            customerName,
            margin + 12,
            y - 40,
            {
                font: boldFont,
                size: 10,
                color: dark,
            }
        );

        drawText(
            page,
            customerEmail,
            margin + 12,
            y - 56,
            {
                font: regularFont,
                size: 8,
                color: muted,
            }
        );

        drawText(
            page,
            `Phone: ${customerPhone}`,
            margin + 12,
            y - 72,
            {
                font: regularFont,
                size: 8,
                color: muted,
            }
        );

        drawText(
            page,
            "Order Status:",
            margin + 12,
            y - 92,
            {
                font: regularFont,
                size: 8,
                color: muted,
            }
        );

        drawText(
            page,
            safeText(
                order.status
            ).toUpperCase(),
            margin + 85,
            y - 92,
            {
                font: boldFont,
                size: 8,
                color:
                    order.status ===
                    "cancelled"
                        ? red
                        : green,
            }
        );

        // SHIPPING

        const shippingX =
            margin +
            cardWidth +
            15;

        drawText(
            page,
            "SHIP TO",
            shippingX + 12,
            y - 20,
            {
                font: boldFont,
                size: 9,
                color: primary,
            }
        );

        const address =
            order.shippingAddress;

        drawText(
            page,
            safeText(
                address?.fullName
            ),
            shippingX + 12,
            y - 40,
            {
                font: boldFont,
                size: 10,
                color: dark,
            }
        );

        drawText(
            page,
            safeText(
                address?.address
            ),
            shippingX + 12,
            y - 56,
            {
                font: regularFont,
                size: 8,
                color: muted,
                maxWidth:
                    cardWidth - 24,
            }
        );

        drawText(
            page,
            `${safeText(
                address?.city
            )}, ${safeText(
                address?.region
            )}`,
            shippingX + 12,
            y - 72,
            {
                font: regularFont,
                size: 8,
                color: muted,
            }
        );

        drawText(
            page,
            `${safeText(
                address?.postalCode
            )}, ${safeText(
                address?.country ||
                    "India"
            )}`,
            shippingX + 12,
            y - 87,
            {
                font: regularFont,
                size: 8,
                color: muted,
            }
        );

        drawText(
            page,
            `Phone: ${safeText(
                address?.phone
            )}`,
            shippingX + 12,
            y - 103,
            {
                font: regularFont,
                size: 8,
                color: muted,
            }
        );

        y -= 145;

        // ========================================================
        // ITEMS TABLE
        // ========================================================

        drawText(
            page,
            "ORDER ITEMS",
            margin,
            y,
            {
                font: boldFont,
                size: 11,
                color: dark,
            }
        );

        y -= 18;

        const tableX = margin;

        const tableWidth =
            pageWidth -
            margin * 2;

        const colProduct = 245;
        const colQty = 55;
        const colPrice = 90;
        const colTotal = 90;

        // Header

        page.drawRectangle({
            x: tableX,
            y: y - 25,
            width: tableWidth,
            height: 25,
            color: primary,
        });

        drawText(
            page,
            "PRODUCT",
            tableX + 8,
            y - 17,
            {
                font: boldFont,
                size: 8,
                color: rgb(
                    1,
                    1,
                    1
                ),
            }
        );

        drawText(
            page,
            "QTY",
            tableX +
                colProduct +
                10,
            y - 17,
            {
                font: boldFont,
                size: 8,
                color: rgb(
                    1,
                    1,
                    1
                ),
            }
        );

        drawText(
            page,
            "PRICE",
            tableX +
                colProduct +
                colQty +
                10,
            y - 17,
            {
                font: boldFont,
                size: 8,
                color: rgb(
                    1,
                    1,
                    1
                ),
            }
        );

        drawText(
            page,
            "TOTAL",
            tableX +
                colProduct +
                colQty +
                colPrice +
                10,
            y - 17,
            {
                font: boldFont,
                size: 8,
                color: rgb(
                    1,
                    1,
                    1
                ),
            }
        );

        y -= 25;

        // ========================================================
        // PRODUCTS
        // ========================================================

        const items =
            Array.isArray(
                order.items
            )
                ? order.items
                : [];

        for (
            let index = 0;
            index < items.length;
            index++
        ) {
            const item =
                items[index];

            // New page if needed
            if (y < 150) {
                page =
                    pdfDoc.addPage([
                        pageWidth,
                        pageHeight,
                    ]);

                y =
                    pageHeight -
                    margin;

                drawText(
                    page,
                    "ORDER ITEMS - CONTINUED",
                    margin,
                    y,
                    {
                        font: boldFont,
                        size: 11,
                        color: dark,
                    }
                );

                y -= 25;
            }

            const quantity =
                Number(
                    item.quantity || 0
                );

            const price =
                Number(
                    item.price || 0
                );

            const total =
                quantity * price;

            if (
                index % 2 ===
                0
            ) {
                page.drawRectangle({
                    x: tableX,
                    y: y - 36,
                    width: tableWidth,
                    height: 36,
                    color: rgb(
                        0.975,
                        0.978,
                        0.982
                    ),
                });
            }

            drawText(
                page,
                safeText(
                    item.name ||
                        "Product"
                ),
                tableX + 8,
                y - 15,
                {
                    font: boldFont,
                    size: 8,
                    color: dark,
                    maxWidth:
                        colProduct -
                        16,
                }
            );

            const productSlug =
                item.product?.slug;

            if (productSlug) {
                drawText(
                    page,
                    `SKU: ${safeText(
                        productSlug
                    )}`,
                    tableX + 8,
                    y - 28,
                    {
                        font: regularFont,
                        size: 6.5,
                        color: muted,
                        maxWidth:
                            colProduct -
                            16,
                    }
                );
            }

            drawText(
                page,
                String(quantity),
                tableX +
                    colProduct +
                    12,
                y - 19,
                {
                    font: regularFont,
                    size: 8,
                    color: dark,
                }
            );

            drawText(
                page,
                money(price),
                tableX +
                    colProduct +
                    colQty +
                    8,
                y - 19,
                {
                    font: regularFont,
                    size: 8,
                    color: dark,
                }
            );

            drawText(
                page,
                money(total),
                tableX +
                    colProduct +
                    colQty +
                    colPrice +
                    8,
                y - 19,
                {
                    font: boldFont,
                    size: 8,
                    color: dark,
                }
            );

            drawLine(
                page,
                tableX,
                y - 36,
                tableX +
                    tableWidth,
                y - 36,
                rgb(
                    0.90,
                    0.91,
                    0.93
                ),
                0.5
            );

            y -= 36;
        }

        y -= 22;

        // ========================================================
        // SUMMARY + PAYMENT
        // ========================================================

        const summaryWidth =
            225;

        const summaryX =
            pageWidth -
            margin -
            summaryWidth;

        drawBox(
            page,
            summaryX,
            y - 135,
            summaryWidth,
            135,
            rgb(
                0.98,
                0.98,
                0.99
            )
        );

        drawText(
            page,
            "PRICE SUMMARY",
            summaryX + 14,
            y - 20,
            {
                font: boldFont,
                size: 9,
                color: primary,
            }
        );

        drawText(
            page,
            "Items Total",
            summaryX + 14,
            y - 43,
            {
                font: regularFont,
                size: 8,
                color: muted,
            }
        );

        drawText(
            page,
            money(
                order.itemsTotal
            ),
            summaryX +
                115,
            y - 43,
            {
                font: regularFont,
                size: 8,
                color: dark,
            }
        );

        drawText(
            page,
            "Shipping",
            summaryX + 14,
            y - 61,
            {
                font: regularFont,
                size: 8,
                color: muted,
            }
        );

        drawText(
            page,
            money(
                order.shippingPrice
            ),
            summaryX +
                115,
            y - 61,
            {
                font: regularFont,
                size: 8,
                color: dark,
            }
        );

        drawText(
            page,
            "Tax",
            summaryX + 14,
            y - 79,
            {
                font: regularFont,
                size: 8,
                color: muted,
            }
        );

        drawText(
            page,
            money(
                order.taxPrice
            ),
            summaryX +
                115,
            y - 79,
            {
                font: regularFont,
                size: 8,
                color: dark,
            }
        );

        drawLine(
            page,
            summaryX + 14,
            y - 91,
            summaryX +
                summaryWidth -
                14,
            y - 91
        );

        drawText(
            page,
            "GRAND TOTAL",
            summaryX + 14,
            y - 113,
            {
                font: boldFont,
                size: 10,
                color: dark,
            }
        );

        drawText(
            page,
            money(
                order.totalPrice
            ),
            summaryX +
                115,
            y - 113,
            {
                font: boldFont,
                size: 10,
                color: primary,
            }
        );

        // ========================================================
        // PAYMENT CARD
        // ========================================================

        const paymentX =
            margin;

        drawBox(
            page,
            paymentX,
            y - 135,
            285,
            135,
            rgb(
                0.98,
                0.98,
                0.99
            )
        );

        drawText(
            page,
            "PAYMENT INFORMATION",
            paymentX + 14,
            y - 20,
            {
                font: boldFont,
                size: 9,
                color: primary,
            }
        );

        drawText(
            page,
            "Method",
            paymentX + 14,
            y - 43,
            {
                font: regularFont,
                size: 8,
                color: muted,
            }
        );

        drawText(
            page,
            safeText(
                order.payment
                    ?.method ||
                    "COD"
            ),
            paymentX + 90,
            y - 43,
            {
                font: boldFont,
                size: 8,
                color: dark,
            }
        );

        drawText(
            page,
            "Payment Status",
            paymentX + 14,
            y - 61,
            {
                font: regularFont,
                size: 8,
                color: muted,
            }
        );

        drawText(
            page,
            order.payment?.paid
                ? "PAID"
                : "PENDING",
            paymentX + 90,
            y - 61,
            {
                font: boldFont,
                size: 8,
                color:
                    order.payment
                        ?.paid
                        ? green
                        : rgb(
                              0.75,
                              0.42,
                              0.05
                          ),
            }
        );

        if (
            order.payment
                ?.transactionId
        ) {
            drawText(
                page,
                "Transaction ID",
                paymentX + 14,
                y - 79,
                {
                    font: regularFont,
                    size: 8,
                    color: muted,
                }
            );

            drawText(
                page,
                safeText(
                    order.payment
                        .transactionId
                ),
                paymentX + 90,
                y - 79,
                {
                    font: regularFont,
                    size: 8,
                    color: dark,
                    maxWidth: 175,
                }
            );
        }

        if (
            order.payment?.paidAt
        ) {
            drawText(
                page,
                "Paid On",
                paymentX + 14,
                y - 97,
                {
                    font: regularFont,
                    size: 8,
                    color: muted,
                }
            );

            drawText(
                page,
                formatDateTime(
                    order.payment
                        .paidAt
                ),
                paymentX + 90,
                y - 97,
                {
                    font: regularFont,
                    size: 8,
                    color: dark,
                }
            );
        }

        y -= 165;

        // ========================================================
        // STATUS HISTORY
        // ========================================================

        const history =
            Array.isArray(
                order.statusHistory
            )
                ? order.statusHistory
                : [];

        if (
            history.length > 0
        ) {
            if (y < 220) {
                page =
                    pdfDoc.addPage([
                        pageWidth,
                        pageHeight,
                    ]);

                y =
                    pageHeight -
                    margin;
            }

            drawText(
                page,
                "ORDER TIMELINE",
                margin,
                y,
                {
                    font: boldFont,
                    size: 11,
                    color: dark,
                }
            );

            y -= 20;

            for (
                const event of history
            ) {
                if (y < 100) {
                    page =
                        pdfDoc.addPage([
                            pageWidth,
                            pageHeight,
                        ]);

                    y =
                        pageHeight -
                        margin;
                }

                page.drawCircle({
                    x: margin + 7,
                    y: y - 5,
                    size: 5,
                    color: primary,
                });

                drawText(
                    page,
                    safeText(
                        event.status
                    ).toUpperCase(),
                    margin + 22,
                    y - 2,
                    {
                        font: boldFont,
                        size: 8,
                        color: dark,
                    }
                );

                drawText(
                    page,
                    formatDateTime(
                        event.createdAt
                    ),
                    400,
                    y - 2,
                    {
                        font: regularFont,
                        size: 7,
                        color: muted,
                    }
                );

                drawText(
                    page,
                    safeText(
                        event.message
                    ),
                    margin + 22,
                    y - 17,
                    {
                        font: regularFont,
                        size: 7.5,
                        color: muted,
                        maxWidth:
                            350,
                    }
                );

                if (
                    event.changedBy
                        ?.name
                ) {
                    drawText(
                        page,
                        `Updated by: ${safeText(
                            event
                                .changedBy
                                .name
                        )}`,
                        margin + 22,
                        y - 31,
                        {
                            font: regularFont,
                            size: 7,
                            color: muted,
                        }
                    );
                }

                y -= 48;
            }
        }

        // ========================================================
        // ADMIN NOTES
        // ========================================================

        if (
            order.notes
        ) {
            if (y < 120) {
                page =
                    pdfDoc.addPage([
                        pageWidth,
                        pageHeight,
                    ]);

                y =
                    pageHeight -
                    margin;
            }

            y -= 8;

            drawBox(
                page,
                margin,
                y - 65,
                pageWidth -
                    margin * 2,
                65,
                lightBlue,
                rgb(
                    0.78,
                    0.85,
                    0.96
                )
            );

            drawText(
                page,
                "ORDER NOTES",
                margin + 12,
                y - 20,
                {
                    font: boldFont,
                    size: 8,
                    color: primary,
                }
            );

            drawText(
                page,
                safeText(
                    order.notes
                ),
                margin + 12,
                y - 38,
                {
                    font: regularFont,
                    size: 8,
                    color: dark,
                    maxWidth:
                        pageWidth -
                        margin * 2 -
                        24,
                }
            );

            y -= 82;
        }

        // ========================================================
        // FOOTER
        // ========================================================

        const pages =
            pdfDoc.getPages();

        pages.forEach(
            (
                currentPage,
                index
            ) => {
                const footerY =
                    25;

                drawLine(
                    currentPage,
                    margin,
                    footerY + 12,
                    pageWidth -
                        margin,
                    footerY + 12,
                    rgb(
                        0.88,
                        0.89,
                        0.91
                    ),
                    0.7
                );

                drawText(
                    currentPage,
                    "Thank you for shopping with DEEPAK KHIRA ENTERPRISES.",
                    margin,
                    footerY,
                    {
                        font: regularFont,
                        size: 7,
                        color: muted,
                    }
                );

                drawText(
                    currentPage,
                    `Page ${
                        index + 1
                    } of ${
                        pages.length
                    }`,
                    pageWidth -
                        margin -
                        65,
                    footerY,
                    {
                        font: regularFont,
                        size: 7,
                        color: muted,
                    }
                );
            }
        );

        // ========================================================
        // SAVE PDF
        // ========================================================

        const pdfBytes =
            await pdfDoc.save();

        const invoiceNumber =
            `INV-${String(
                order._id
            )
                .slice(-8)
                .toUpperCase()}`;

        return new NextResponse(
            Buffer.from(pdfBytes),
            {
                status: 200,

                headers: {
                    "Content-Type":
                        "application/pdf",

                    "Content-Disposition":
                        `inline; filename="${invoiceNumber}.pdf"`,

                    "Cache-Control":
                        "private, no-store, max-age=0",
                },
            }
        );
    } catch (error) {
        console.error(
            "ADMIN PDF INVOICE ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to generate PDF invoice.",
            },
            {
                status: 500,
            }
        );
    }
}