import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    image: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
    },

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
      method: {
        type: String,
        enum: ["COD", "ONLINE"],
        default: "COD",
        index: true,
      },
    
      status: {
        type: String,
        enum: [
          "pending",
          "authorized",
          "captured",
          "failed",
          "refunded",
          "partially_refunded",
        ],
        default: "pending",
        index: true,
      },
    
      paid: {
        type: Boolean,
        default: false,
      },
    
      paidAt: Date,
    
      transactionId: {
        type: String,
        default: "",
        index: true,
      },
    
      razorpayOrderId: {
        type: String,
        default: "",
        index: true,
      },
    
      razorpayPaymentId: {
        type: String,
        default: "",
        index: true,
      },
    
      razorpaySignature: {
        type: String,
        default: "",
      },
    
      failureReason: {
        type: String,
        default: "",
      },
    },

    itemsTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    taxPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "packed",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "placed",
      index: true,
    },

    statusHistory: [
      {
        status: String,
        message: String,
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);