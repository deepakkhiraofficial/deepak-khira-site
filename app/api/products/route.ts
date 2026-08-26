import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// ============================================================
// TYPES
// ============================================================

type SortDirection = 1 | -1;

type ProductQuery = {
  status?: "active" | "draft";

  featured?: boolean;

  $or?: Array<Record<string, unknown>>;

  $and?: Array<Record<string, unknown>>;

  category?: string | { $in: string[] };

  price?: {
    $gte?: number;
    $lte?: number;
  };

  rating?: {
    $gte: number;
  };

  $expr?: Record<string, unknown>;
};

// ============================================================
// CONSTANTS
// ============================================================

const ALLOWED_SORT_FIELDS = new Set([
  "price",
  "createdAt",
  "updatedAt",
  "rating",
  "popularityScore",
  "name",
  "stock",
]);

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 12;

// ============================================================
// HELPERS
// ============================================================

function parseNonNegativeNumber(
  value: string | null
): number | undefined {
  if (value === null || value.trim() === "") {
    return undefined;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return undefined;
  }

  return number;
}

function parsePositiveInteger(
  value: string | null,
  fallback: number
): number {
  if (value === null || value.trim() === "") {
    return fallback;
  }

  const number = Number(value);

  if (!Number.isInteger(number) || number < 1) {
    return fallback;
  }

  return number;
}

function escapeRegex(value: string): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

// ============================================================
// GET PRODUCTS
// PUBLIC
// ============================================================

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // ========================================================
    // BASIC PARAMETERS
    // ========================================================

    const search =
      searchParams.get("search")?.trim() || "";

    const page = parsePositiveInteger(
      searchParams.get("page"),
      1
    );

    const requestedLimit = parsePositiveInteger(
      searchParams.get("limit"),
      DEFAULT_LIMIT
    );

    const limit = Math.min(
      requestedLimit,
      MAX_LIMIT
    );

    const skip = (page - 1) * limit;

    // ========================================================
    // STATUS
    // ========================================================

    const statusParam =
      searchParams.get("status");

    const status =
      statusParam === "draft"
        ? "draft"
        : "active";

    // ========================================================
    // FEATURED
    // ========================================================

    const featuredParam =
      searchParams.get("featured");

    // ========================================================
    // CATEGORY
    // ========================================================

    const categories =
      searchParams
        .get("categories")
        ?.split(",")
        .map((category) => category.trim())
        .filter(Boolean) || [];

    // Also support singular category
    const singleCategory =
      searchParams
        .get("category")
        ?.trim() || "";

    // ========================================================
    // PRICE
    // ========================================================

    const minPrice = parseNonNegativeNumber(
      searchParams.get("minPrice")
    );

    const maxPrice = parseNonNegativeNumber(
      searchParams.get("maxPrice")
    );

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Minimum price cannot be greater than maximum price.",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // RATING
    // ========================================================

    const minRatingRaw =
      parseNonNegativeNumber(
        searchParams.get("minRating")
      );

    const minRating =
      minRatingRaw !== undefined
        ? Math.min(minRatingRaw, 5)
        : undefined;

    // ========================================================
    // STOCK
    // ========================================================

    const inStock =
      searchParams.get("inStock");

    // ========================================================
    // QUERY
    // ========================================================

    const query: ProductQuery = {
      status,
    };

    // ========================================================
    // FEATURED FILTER
    // ========================================================

    if (featuredParam === "true") {
      query.featured = true;
    }

    if (featuredParam === "false") {
      query.featured = false;
    }

    // ========================================================
    // SEARCH
    // ========================================================

    if (search) {
      const escapedSearch =
        escapeRegex(search);

      query.$or = [
        {
          name: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          description: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          category: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          slug: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    // ========================================================
    // CATEGORY FILTER
    // ========================================================

    if (categories.length > 0) {
      if (categories.length === 1) {
        query.category = categories[0];
      } else {
        query.category = {
          $in: categories,
        };
      }
    } else if (singleCategory) {
      query.category = singleCategory;
    }

    // ========================================================
    // PRICE FILTER
    // ========================================================

    if (
      minPrice !== undefined ||
      maxPrice !== undefined
    ) {
      query.price = {};

      if (minPrice !== undefined) {
        query.price.$gte = minPrice;
      }

      if (maxPrice !== undefined) {
        query.price.$lte = maxPrice;
      }
    }

    // ========================================================
    // RATING FILTER
    // ========================================================

    if (minRating !== undefined) {
      query.rating = {
        $gte: minRating,
      };
    }

    // ========================================================
    // STOCK FILTER
    // ========================================================

    if (inStock === "true") {
      query.$and = [
        {
          $or: [
            {
              inStock: true,
            },
            {
              stock: {
                $gt: 0,
              },
            },
          ],
        },
      ];
    }

    if (inStock === "false") {
      query.$and = [
        {
          stock: {
            $lte: 0,
          },
        },
      ];
    }

    // ========================================================
    // SORT
    // ========================================================

    const sortParam =
      searchParams.get("sort") ||
      "-createdAt";

    const sortQuery: Record<
      string,
      SortDirection
    > = {};

    const sortFields = sortParam
      .split(",")
      .map((field) => field.trim())
      .filter(Boolean);

    for (const field of sortFields) {
      const descending =
        field.startsWith("-");

      const fieldName = descending
        ? field.slice(1)
        : field;

      if (
        !ALLOWED_SORT_FIELDS.has(
          fieldName
        )
      ) {
        continue;
      }

      sortQuery[fieldName] =
        descending ? -1 : 1;
    }

    if (
      Object.keys(sortQuery).length === 0
    ) {
      sortQuery.createdAt = -1;
    }

    // ========================================================
    // DATABASE
    // ========================================================

    const [total, products] =
      await Promise.all([
        Product.countDocuments(query),

        Product.find(query)
          .sort(sortQuery)
          .skip(skip)
          .limit(limit)
          .select("-__v")
          .lean(),
      ]);

    // ========================================================
    // PAGINATION
    // ========================================================

    const totalPages =
      total === 0
        ? 0
        : Math.ceil(total / limit);

    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json(
      {
        success: true,

        products,

        pagination: {
          total,
          page,
          limit,
          totalPages,

          hasNextPage:
            page < totalPages,

          hasPreviousPage:
            page > 1,
        },

        // Backward compatibility
        // for components that may
        // still read totalPages directly.
        totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET PRODUCTS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load products. Please try again later.",
        products: [],
        pagination: {
          total: 0,
          page: 1,
          limit: DEFAULT_LIMIT,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================
// CREATE PRODUCT
// ADMIN ONLY
// ============================================================

export async function POST(req: Request) {
  try {
    // ========================================================
    // ADMIN AUTHORIZATION
    // ========================================================

    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin authorization required.",
        },
        { status: 401 }
      );
    }

    // ========================================================
    // DATABASE
    // ========================================================

    await connectDB();

    // ========================================================
    // BODY
    // ========================================================

    const body = await req.json();

    const {
      name,
      description,
      category,
      price,
      stock,
      images,
      featured,
      status,
      rating,
      popularityScore,
    } = body;

    // ========================================================
    // VALIDATION
    // ========================================================

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product name is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof description !== "string" ||
      description.trim().length < 10
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product description must be at least 10 characters.",
        },
        { status: 400 }
      );
    }

    if (
      typeof category !== "string" ||
      !category.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product category is required.",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // PRICE
    // ========================================================

    const productPrice = Number(price);

    if (
      !Number.isFinite(productPrice) ||
      productPrice < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid product price.",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // STOCK
    // ========================================================

    const productStock = Number(
      stock ?? 0
    );

    if (
      !Number.isFinite(productStock) ||
      productStock < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid stock quantity.",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // IMAGES
    // ========================================================

    const productImages = Array.isArray(
      images
    )
      ? images
          .filter(
            (image): image is string =>
              typeof image === "string" &&
              image.trim().length > 0
          )
          .map((image) => image.trim())
      : [];

    // ========================================================
    // STATUS
    // ========================================================

    const productStatus =
      status === "draft"
        ? "draft"
        : "active";

    // ========================================================
    // FEATURED
    // ========================================================

    const productFeatured =
      featured === true;

    // ========================================================
    // RATING
    // ========================================================

    const productRating =
      Number.isFinite(Number(rating))
        ? Math.min(
            Math.max(Number(rating), 0),
            5
          )
        : 0;

    // ========================================================
    // POPULARITY
    // ========================================================

    const productPopularity =
      Number.isFinite(
        Number(popularityScore)
      )
        ? Math.max(
            Number(popularityScore),
            0
          )
        : 0;

    // ========================================================
    // CREATE
    // ========================================================

    const product =
      await Product.create({
        name: name.trim(),

        description:
          description.trim(),

        category:
          category.trim(),

        price: productPrice,

        stock: productStock,

        inStock:
          productStock > 0,

        images:
          productImages,

        featured:
          productFeatured,

        status:
          productStatus,

        rating:
          productRating,

        popularityScore:
          productPopularity,
      });

    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json(
      {
        success: true,
        message:
          "Product created successfully.",
        product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(
      "CREATE PRODUCT API ERROR:",
      error
    );

    // ========================================================
    // DUPLICATE
    // ========================================================

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A product with the same slug already exists.",
        },
        { status: 409 }
      );
    }

    // ========================================================
    // MONGOOSE VALIDATION
    // ========================================================

    if (
      error?.name ===
      "ValidationError"
    ) {
      const messages =
        Object.values(
          error.errors || {}
        ).map(
          (item: any) =>
            item.message
        );

      return NextResponse.json(
        {
          success: false,
          message:
            messages.join(", ") ||
            "Product validation failed.",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // GENERAL ERROR
    // ========================================================

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to create product.",
      },
      { status: 500 }
    );
  }
}