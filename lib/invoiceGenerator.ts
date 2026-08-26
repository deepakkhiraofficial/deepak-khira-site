import PDFDocument from "pdfkit";

export function generateInvoicePDF(order: any, resStream: any) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  doc.pipe(resStream);

  // Header
  doc.fontSize(20).text("INVOICE", { align: "right" });
  doc.moveDown();
  doc.fontSize(12).text(`Order ID: ${order._id}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.moveDown();

  // Seller
  doc.fontSize(14).text("Seller:", { underline: true });
  doc.fontSize(12).text("Deepak Khira Enterprises");
  doc.text("Dabra, Gwalior, Madhya Pradesh, India");
  doc.text("Email: deepakkhushwah475110@gmail.com");
  doc.moveDown();

  // Buyer
  doc.fontSize(14).text("Bill To:", { underline: true });
  const s = order.shippingAddress || {};
  doc.fontSize(12).text(`${s.fullName || ""}`);
  doc.text(`${s.address || ""}, ${s.city || ""}`);
  doc.text(`${s.postalCode || ""} ${s.region || ""}`);
  doc.moveDown();

  // Table header
  doc.fontSize(12).text("Items:", { underline: true });
  doc.moveDown(0.5);

  // Items table
  order.items.forEach((item: any, i: number) => {
    doc.text(`${i + 1}. ${item.name} x ${item.quantity}`, { continued: true });
    doc.text(` — ₹${(item.price * item.quantity).toFixed(2)}`, { align: "right" });
  });

  doc.moveDown();
  doc.text(`Items Total: ₹${order.itemsTotal.toFixed(2)}`);
  doc.text(`Shipping: ₹${order.shippingPrice.toFixed(2)}`);
  doc.text(`Tax: ₹${order.taxPrice.toFixed(2)}`);
  doc.moveDown();
  doc.fontSize(16).text(`Total: ₹${order.totalPrice.toFixed(2)}`, { bold: true });

  doc.end();
}
