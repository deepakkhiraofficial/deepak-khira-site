import mongoose from "mongoose";
import slugify from "slugify";

// ============================================================
// PRODUCT TYPE
// ============================================================

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  inStock: boolean;
  images: string[];
  featured: boolean;
  status: "active" | "draft";
  rating: number;
  popularityScore: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================
// PRODUCT SCHEMA
// ============================================================

const ProductSchema =
  new mongoose.Schema<IProduct>(
    {
      // ======================================================
      // BASIC INFORMATION
      // ======================================================

      name: {
        type: String,
        required: [
          true,
          "Product name is required",
        ],
        trim: true,
        minlength: [
          2,
          "Product name must be at least 2 characters",
        ],
        maxlength: [
          200,
          "Product name cannot exceed 200 characters",
        ],
      },

      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
      },

      description: {
        type: String,
        required: [
          true,
          "Product description is required",
        ],
        trim: true,
        minlength: [
          10,
          "Product description must be at least 10 characters",
        ],
      },

      category: {
        type: String,
        required: [
          true,
          "Product category is required",
        ],
        trim: true,
        index: true,
      },

      // ======================================================
      // PRICING
      // ======================================================

      price: {
        type: Number,
        required: [
          true,
          "Product price is required",
        ],
        min: [
          0,
          "Price cannot be negative",
        ],
      },

      // ======================================================
      // INVENTORY
      // ======================================================

      stock: {
        type: Number,
        default: 0,
        min: [
          0,
          "Stock cannot be negative",
        ],
      },

      inStock: {
        type: Boolean,
        default: false,
        index: true,
      },

      // ======================================================
      // MEDIA
      // ======================================================

      images: {
        type: [String],
        default: [],
        validate: {
          validator: (
            images: string[]
          ) =>
            images.every(
              (image) =>
                typeof image === "string" &&
                image.trim().length > 0
            ),

          message:
            "Product images must contain valid image URLs.",
        },
      },

      // ======================================================
      // PRODUCT STATUS
      // ======================================================

      featured: {
        type: Boolean,
        default: false,
        index: true,
      },

      status: {
        type: String,
        enum: {
          values: [
            "active",
            "draft",
          ],
          message:
            "Product status must be active or draft.",
        },
        default: "active",
        index: true,
      },

      // ======================================================
      // ANALYTICS
      // ======================================================

      rating: {
        type: Number,
        default: 0,
        min: [
          0,
          "Rating cannot be below 0.",
        ],
        max: [
          5,
          "Rating cannot exceed 5.",
        ],
      },

      popularityScore: {
        type: Number,
        default: 0,
        min: [
          0,
          "Popularity score cannot be negative.",
        ],
      },
    },

    {
      timestamps: true,

      // Prevent unknown fields from being
      // silently stored in MongoDB.
      strict: true,
    }
  );

// ============================================================
// AUTO GENERATE SLUG
// ============================================================

ProductSchema.pre(
  "validate",
  function () {
    if (
      this.name &&
      (!this.slug ||
        this.isModified("name"))
    ) {
      this.slug = slugify(
        this.name,
        {
          lower: true,
          strict: true,
          trim: true,
        }
      );
    }
  }
);

// ============================================================
// KEEP STOCK STATUS IN SYNC
// ============================================================

ProductSchema.pre(
  "save",
  function () {
    this.inStock =
      Number(this.stock) > 0;
  }
);

// ============================================================
// DATABASE INDEXES
// ============================================================

// Text search
ProductSchema.index({
  name: "text",
  description: "text",
});

// Category + status + newest
ProductSchema.index({
  category: 1,
  status: 1,
  createdAt: -1,
});

// Featured products
ProductSchema.index({
  featured: 1,
  status: 1,
  createdAt: -1,
});

// Price sorting/filtering
ProductSchema.index({
  status: 1,
  price: 1,
});

// Popular products
ProductSchema.index({
  status: 1,
  popularityScore: -1,
});

// Rating sorting/filtering
ProductSchema.index({
  status: 1,
  rating: -1,
});

// Stock filtering
ProductSchema.index({
  status: 1,
  inStock: 1,
});

// ============================================================
// MODEL
// ============================================================

const Product =
  mongoose.models.Product ||
  mongoose.model<IProduct>(
    "Product",
    ProductSchema
  );

export default Product;