import PDFDocument from "pdfkit";

export function generateInvoicePDF(order: any, resStream: any) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });

  doc.pipe(resStream);

  // =========================================================
  // HEADER
  // =========================================================

  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .text("INVOICE", {
      align: "right",
    });

  doc.font("Helvetica");

  doc.moveDown();

  doc
    .fontSize(12)
    .text(`Order ID: ${order?._id ?? ""}`);

  doc.text(
    `Date: ${
      order?.createdAt
        ? new Date(order.createdAt).toLocaleString()
        : new Date().toLocaleString()
    }`
  );

  doc.moveDown();

  // =========================================================
  // SELLER
  // =========================================================

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("Seller:", {
      underline: true,
    });

  doc.font("Helvetica");

  doc.fontSize(12).text("Deepak Khira Enterprises");
  doc.text("Dabra, Gwalior, Madhya Pradesh, India");
  doc.text("Email: deepakkhushwah475110@gmail.com");

  doc.moveDown();

  // =========================================================
  // BUYER
  // =========================================================

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("Bill To:", {
      underline: true,
    });

  doc.font("Helvetica");

  const s = order?.shippingAddress || {};

  doc.fontSize(12).text(s.fullName || "");
  doc.text(
    `${s.address || ""}${s.city ? `, ${s.city}` : ""}`
  );

  doc.text(
    `${s.postalCode || ""}${s.region ? ` ${s.region}` : ""}`
  );

  doc.moveDown();

  // =========================================================
  // ITEMS
  // =========================================================

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Items:", {
      underline: true,
    });

  doc.font("Helvetica");

  doc.moveDown(0.5);

  const items = Array.isArray(order?.items) ? order.items : [];

  items.forEach((item: any, i: number) => {
    const quantity = Number(item?.quantity ?? 0);
    const price = Number(item?.price ?? 0);
    const itemTotal = price * quantity;

    doc.text(
      `${i + 1}. ${item?.name || "Product"} x ${quantity}`,
      {
        continued: true,
      }
    );

    doc.text(` — ₹${itemTotal.toFixed(2)}`, {
      align: "right",
    });
  });

  doc.moveDown();

  // =========================================================
  // PRICE SUMMARY
  // =========================================================

  const itemsTotal = Number(order?.itemsTotal ?? 0);
  const shippingPrice = Number(order?.shippingPrice ?? 0);
  const taxPrice = Number(order?.taxPrice ?? 0);
  const totalPrice = Number(order?.totalPrice ?? 0);

  doc.fontSize(12);

  doc.text(`Items Total: ₹${itemsTotal.toFixed(2)}`);
  doc.text(`Shipping: ₹${shippingPrice.toFixed(2)}`);
  doc.text(`Tax: ₹${taxPrice.toFixed(2)}`);

  doc.moveDown();

  // =========================================================
  // GRAND TOTAL
  // =========================================================

  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text(`Total: ₹${totalPrice.toFixed(2)}`);

  doc.font("Helvetica");

  // =========================================================
  // FOOTER
  // =========================================================

  doc.moveDown(2);

  doc
    .fontSize(10)
    .fillColor("#666666")
    .text(
      "Thank you for shopping with Deepak Khira Enterprises.",
      {
        align: "center",
      }
    );

  doc
    .fillColor("#000000")
    .text(
      "This is a computer-generated invoice.",
      {
        align: "center",
      }
    );

  // =========================================================
  // END PDF
  // =========================================================

  doc.end();
}