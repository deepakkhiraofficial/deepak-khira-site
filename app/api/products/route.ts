import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

// ============================================================
// ROUTE CONFIG
// ============================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ============================================================
// TYPES
// ============================================================

type SortDirection = 1 | -1;

type PriceQuery = {
  $gte?: number;
  $lte?: number;
};

type ProductQuery = {
  status: "active" | "draft";

  featured?: boolean;

  category?: string | { $in: string[] };

  price?: PriceQuery;

  rating?: {
    $gte: number;
  };

  inStock?: boolean;

  $text?: {
    $search: string;
  };

  $or?: Array<Record<string, unknown>>;
};

type ProductListItem = {
  _id: mongoose.Types.ObjectId;
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
};

// ============================================================
// CONSTANTS
// ============================================================

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 12;

const PRODUCT_SELECT = [
  "_id",
  "name",
  "slug",
  "description",
  "category",
  "price",
  "stock",
  "inStock",
  "images",
  "featured",
  "status",
  "rating",
  "popularityScore",
  "createdAt",
  "updatedAt",
].join(" ");

const ALLOWED_SORT_FIELDS = new Set([
  "price",
  "createdAt",
  "updatedAt",
  "rating",
  "popularityScore",
  "name",
  "stock",
]);

// ============================================================
// HELPERS
// ============================================================

function parseNonNegativeNumber(
  value: string | null
): number | undefined {
  if (!value || value.trim() === "") {
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
  if (!value || value.trim() === "") {
    return fallback;
  }

  const number = Number(value);

  if (!Number.isInteger(number) || number < 1) {
    return fallback;
  }

  return number;
}

function normalizeString(
  value: string | null
): string {
  return value?.trim() || "";
}

function parseBoolean(
  value: string | null
): boolean | undefined {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

// ============================================================
// SORT BUILDER
// ============================================================

function buildSort(
  sortParam: string
): Record<string, SortDirection> {
  const sortQuery: Record<
    string,
    SortDirection
  > = {};

  const fields = sortParam
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);

  for (const field of fields) {
    const descending = field.startsWith("-");

    const fieldName = descending
      ? field.slice(1)
      : field;

    if (!ALLOWED_SORT_FIELDS.has(fieldName)) {
      continue;
    }

    sortQuery[fieldName] = descending ? -1 : 1;
  }

  if (Object.keys(sortQuery).length === 0) {
    sortQuery.createdAt = -1;
  }

  // Deterministic ordering.
  if (!Object.prototype.hasOwnProperty.call(sortQuery, "_id")) {
    sortQuery._id = -1;
  }

  return sortQuery;
}

// ============================================================
// RESPONSE CACHE HEADERS
// ============================================================

function getCacheHeaders() {
  return {
    "Cache-Control":
      "public, s-maxage=60, stale-while-revalidate=300",

    "CDN-Cache-Control":
      "public, s-maxage=60, stale-while-revalidate=300",

    "Vercel-CDN-Cache-Control":
      "public, s-maxage=60, stale-while-revalidate=300",

    Vary: "Accept-Encoding",
  };
}

// ============================================================
// GET PRODUCTS
// PUBLIC
// ============================================================

export async function GET(req: Request) {
  const startedAt = Date.now();

  try {
    const { searchParams } = new URL(req.url);

    // ========================================================
    // PAGINATION
    // ========================================================

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
    // FILTERS
    // ========================================================

    const search = normalizeString(
      searchParams.get("search")
    );

    const featured = parseBoolean(
      searchParams.get("featured")
    );

    const inStock = parseBoolean(
      searchParams.get("inStock")
    );

    const singleCategory = normalizeString(
      searchParams.get("category")
    );

    const categories = searchParams
      .get("categories")
      ?.split(",")
      .map((category) => category.trim())
      .filter(Boolean) || [];

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
        {
          status: 400,
          headers: getCacheHeaders(),
        }
      );
    }

    // ========================================================
    // RATING
    // ========================================================

    const ratingValue = parseNonNegativeNumber(
      searchParams.get("minRating")
    );

    const minRating =
      ratingValue !== undefined
        ? Math.min(ratingValue, 5)
        : undefined;

    // ========================================================
    // QUERY
    // ========================================================

    const query: ProductQuery = {
      // Public API must NEVER expose drafts.
      status: "active",
    };

    // ========================================================
    // FEATURED
    // ========================================================

    if (featured !== undefined) {
      query.featured = featured;
    }

    // ========================================================
    // STOCK
    // ========================================================

    if (inStock !== undefined) {
      query.inStock = inStock;
    }

    // ========================================================
    // CATEGORY
    // ========================================================

    if (categories.length > 0) {
      query.category =
        categories.length === 1
          ? categories[0]
          : {
              $in: categories,
            };
    } else if (singleCategory) {
      query.category = singleCategory;
    }

    // ========================================================
    // PRICE
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
    // RATING
    // ========================================================

    if (minRating !== undefined) {
      query.rating = {
        $gte: minRating,
      };
    }

    // ========================================================
    // SEARCH
    // ========================================================

    if (search) {
      const searchRegexSafe = search
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .slice(0, 100);

      query.$or = [
        {
          $text: {
            $search: search,
          },
        },
        {
          slug: search.toLowerCase(),
        },
        {
          category: search,
        },
      ];

      // Prevent unused-variable issues if regex fallback
      // is added later.
      void searchRegexSafe;
    }

    // ========================================================
    // SORT
    // ========================================================

    const sortParam =
      normalizeString(
        searchParams.get("sort")
      ) || "-createdAt";

    const sortQuery =
      buildSort(sortParam);

    // ========================================================
    // DATABASE
    // ========================================================

    await connectDB();

    // ========================================================
    // HOMEPAGE OPTIMIZATION
    // ========================================================
    //
    // Homepage request:
    //
    // featured=true
    // status=active
    // limit=3
    // page=1
    // sort=-popularityScore,-createdAt
    //
    // It does NOT need a complete count.
    // Avoid countDocuments() here.
    // ========================================================

    const isHomepageFeaturedRequest =
      featured === true &&
      page === 1 &&
      limit <= 3 &&
      !search &&
      categories.length === 0 &&
      !singleCategory &&
      minPrice === undefined &&
      maxPrice === undefined &&
      minRating === undefined &&
      inStock === undefined;

    let products: ProductListItem[] = [];
    let total = 0;

    if (isHomepageFeaturedRequest) {
      products = await Product.find(query)
        .sort(sortQuery)
        .limit(limit)
        .select(PRODUCT_SELECT)
        .lean<ProductListItem[]>()
        .exec();

      total = products.length;
    } else {
      const [count, results] =
        await Promise.all([
          Product.countDocuments(query),

          Product.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(limit)
            .select(PRODUCT_SELECT)
            .lean<ProductListItem[]>()
            .exec(),
        ]);

      total = count;
      products = results;
    }

    // ========================================================
    // PAGINATION
    // ========================================================

    const totalPages =
      total > 0
        ? Math.ceil(total / limit)
        : 0;

    // ========================================================
    // PERFORMANCE LOG
    // ========================================================

    const duration = Date.now() - startedAt;

    if (duration > 1000) {
      console.warn(
        `[PRODUCTS API] Slow request: ${duration}ms`,
        {
          page,
          limit,
          featured,
          search: Boolean(search),
        }
      );
    }

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
        totalPages,
      },
      {
        status: 200,
        headers: getCacheHeaders(),
      }
    );
  } catch (error: unknown) {
    const duration = Date.now() - startedAt;

    console.error(
      `[PRODUCTS API] GET failed after ${duration}ms:`,
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
      {
        status: 500,
      }
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
    // ADMIN AUTH
    // ========================================================

    const admin = await requireAdmin();

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
    // DATABASE
    // ========================================================

    await connectDB();

    const body = await req.json();

    // ========================================================
    // BASIC INPUT
    // ========================================================

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const category =
      typeof body.category === "string"
        ? body.category.trim()
        : "";

    // ========================================================
    // VALIDATION
    // ========================================================

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length < 2 || name.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product name must be between 2 and 200 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (description.length < 10) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product description must be at least 10 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product category is required.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // PRICE
    // ========================================================

    const productPrice = Number(body.price);

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
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // STOCK
    // ========================================================

    const productStock = Number(
      body.stock ?? 0
    );

    if (
      !Number.isInteger(productStock) ||
      productStock < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Stock must be a non-negative integer.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // IMAGES
    // ========================================================

    const productImages: string[] =
  Array.isArray(body.images)
    ? (body.images as unknown[])
        .filter(
          (image: unknown): image is string =>
            typeof image === "string" &&
            image.trim().length > 0
        )
        .map((image: string): string =>
          image.trim()
        )
    : [];

    // ========================================================
    // FEATURED
    // ========================================================

    const productFeatured =
      body.featured === true;

    // ========================================================
    // STATUS
    // ========================================================

    const productStatus =
      body.status === "draft"
        ? "draft"
        : "active";

    // ========================================================
    // RATING
    // ========================================================

    const ratingNumber = Number(
      body.rating ?? 0
    );

    const productRating =
      Number.isFinite(ratingNumber)
        ? Math.min(
            Math.max(
              ratingNumber,
              0
            ),
            5
          )
        : 0;

    // ========================================================
    // POPULARITY
    // ========================================================

    const popularityNumber =
      Number(
        body.popularityScore ?? 0
      );

    const productPopularity =
      Number.isFinite(
        popularityNumber
      )
        ? Math.max(
            popularityNumber,
            0
          )
        : 0;

    // ========================================================
    // CREATE
    // ========================================================

    const product =
      await Product.create({
        name,
        description,
        category,

        price: productPrice,

        stock: productStock,

        inStock:
          productStock > 0,

        images: productImages,

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
      {
        status: 201,
      }
    );
  } catch (error: unknown) {
    console.error(
      "CREATE PRODUCT API ERROR:",
      error
    );

    // ========================================================
    // DUPLICATE KEY
    // ========================================================

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (
        error as {
          code?: number;
        }
      ).code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A product with the same slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // ========================================================
    // MONGOOSE VALIDATION
    // ========================================================

    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (
        error as {
          name?: string;
        }
      ).name ===
        "ValidationError"
    ) {
      const mongooseError =
        error as {
          errors?: Record<
            string,
            {
              message?: string;
            }
          >;
        };

      const messages =
        Object.values(
          mongooseError.errors || {}
        ).map(
          (item) =>
            item.message ||
            "Invalid value."
        );

      return NextResponse.json(
        {
          success: false,
          message:
            messages.join(", ") ||
            "Product validation failed.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // GENERAL ERROR
    // ========================================================

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create product.",
      },
      {
        status: 500,
      }
    );
  }
}