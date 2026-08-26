import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  image: String,
});

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: [OrderItemSchema],

    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      region: String,
      postalCode: String,
      country: String,
      phone: String,
    },

    payment: {
      method: { type: String, default: "COD" },
      paid: { type: Boolean, default: false },
      paidAt: Date,
      transactionId: String,
    },

    itemsTotal: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    taxPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: ["placed", "confirmed", "packed", "shipped", "delivered", "cancelled", "returned"],
      default: "placed",
    },

    statusHistory: [
      {
        status: String,
        message: String,
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
