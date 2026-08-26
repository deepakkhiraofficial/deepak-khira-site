"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Zap,
  Minus,
  Plus,
  PackageCheck,
  PackageX,
  Star,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { useCart } from "@/components/cart/CartContext";

// ============================================================
// PRODUCT TYPE
// ============================================================

// interface Product {
//   _id: string;
//   name: string;
//   slug: string;
//   description: string;
//   category: string;
//   price: number;
//   stock: number;
//   inStock: boolean;
//   images: string[];
//   featured: boolean;
//   status: "active" | "draft";
//   rating: number;
//   popularityScore: number;
// }

import type { Product } from "@/components/cart/CartContext";

// ============================================================
// PROPS
// ============================================================

interface ProductDetailProps {
  product: Product;
}

// ============================================================
// COMPONENT
// ============================================================

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();

  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);

  // ==========================================================
  // PRODUCT IMAGE
  // ==========================================================

  const image =
    Array.isArray(product.images) &&
    product.images.length > 0 &&
    typeof product.images[0] === "string" &&
    product.images[0].trim()
      ? product.images[0]
      : "/placeholder-product.png";

  // ==========================================================
  // AVAILABILITY
  // ==========================================================

  const isAvailable =
    product.status === "active" &&
    product.inStock === true &&
    Number(product.stock) > 0;

  const safeStock = Math.max(0, Number(product.stock) || 0);

  // ==========================================================
  // PRICE
  // ==========================================================

  const price = Number(product.price) || 0;

  const formattedPrice = price.toLocaleString("en-IN");

  // ==========================================================
  // RATING
  // ==========================================================

  const rating = Math.min(5, Math.max(0, Number(product.rating) || 0));

  const roundedRating = Math.round(rating);

  // ==========================================================
  // QUANTITY
  // ==========================================================

  const decreaseQuantity = () => {
    setQuantity((previous) => Math.max(1, previous - 1));
  };

  const increaseQuantity = () => {
    setQuantity((previous) => Math.min(safeStock, previous + 1));
  };

  // ==========================================================
  // CART PRODUCT
  // ==========================================================
  //
  // Keep the object shape consistent with the product
  // received from the API.
  //
  // This also prevents accidental undefined/incorrect
  // product objects from being passed to CartContext.
  // ==========================================================

  const getCartProduct = (): Product | null => {
    if (!product || typeof product !== "object") {
      return null;
    }

    if (!product._id || !product.name || !product.slug) {
      return null;
    }

    if (!Number.isFinite(price) || price < 0) {
      return null;
    }

    return {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      category: product.category || "",
      price,
      stock: safeStock,
      inStock: product.inStock === true,
      images: Array.isArray(product.images) ? product.images : [],
      featured: product.featured === true,
      status: product.status,
      rating,
      popularityScore: Number(product.popularityScore) || 0,
    };
  };

  // ==========================================================
  // ADD TO CART
  // ==========================================================

  const handleAddToCart = () => {
    if (!isAvailable) {
      toast.error("Product is currently out of stock.");

      return;
    }

    if (quantity < 1 || quantity > safeStock) {
      toast.error("Selected quantity is not available.");

      return;
    }

    const cartProduct = getCartProduct();

    if (!cartProduct) {
      console.error("INVALID PRODUCT PASSED TO CART:", product);

      toast.error("Unable to add this product to cart.");

      return;
    }

    try {
      setAdding(true);

      addToCart(cartProduct, quantity);

      toast.success(`${quantity} × ${product.name} added to cart`);
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);

      toast.error("Unable to add product to cart.");
    } finally {
      setAdding(false);
    }
  };

  // ==========================================================
  // BUY NOW
  // ==========================================================

  const handleBuyNow = () => {
    if (!isAvailable) {
      toast.error("Product is currently out of stock.");

      return;
    }

    if (quantity < 1 || quantity > safeStock) {
      toast.error("Selected quantity is not available.");

      return;
    }

    const cartProduct = getCartProduct();

    if (!cartProduct) {
      console.error("INVALID PRODUCT PASSED TO CART:", product);

      toast.error("Unable to proceed with this product.");

      return;
    }

    try {
      setBuying(true);

      addToCart(cartProduct, quantity);

      router.push("/cart");
    } catch (error) {
      console.error("BUY NOW ERROR:", error);

      toast.error("Unable to proceed.");

      setBuying(false);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ======================================================
          BREADCRUMB
      ======================================================= */}

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="text-sm text-slate-500 dark:text-slate-400"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="transition hover:text-blue-600"
              >
                Home
              </button>
            </li>

            <li aria-hidden="true">/</li>

            <li>
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="transition hover:text-blue-600"
              >
                Products
              </button>
            </li>

            <li aria-hidden="true">/</li>

            <li
              className="max-w-[240px] truncate font-medium text-slate-700 dark:text-slate-300"
              aria-current="page"
            >
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      {/* ======================================================
          PRODUCT SECTION
      ======================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-6 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* ==================================================
                PRODUCT IMAGE
            =================================================== */}

            <div className="relative flex min-h-[420px] items-center justify-center bg-slate-50 p-6 sm:min-h-[520px] dark:bg-slate-800/60">
              {product.featured && (
                <div className="absolute left-5 top-5 z-10 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                  Featured
                </div>
              )}

              <div className="relative flex h-[400px] w-full items-center justify-center sm:h-[500px]">
                <Image
                  src={image}
                  alt={`${product.name} - ${product.category}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-6"
                />
              </div>
            </div>

            {/* ==================================================
                PRODUCT INFORMATION
            =================================================== */}

            <div className="flex flex-col p-6 sm:p-8 lg:p-12">
              {/* Category */}

              <div className="mb-4">
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}

              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {product.name}
              </h1>

              {/* Rating */}

              <div
                className="mt-5 flex items-center gap-3"
                aria-label={
                  rating > 0 ? `Rated ${rating} out of 5` : "No ratings yet"
                }
              >
                <div className="flex items-center gap-0.5">
                  {Array.from({
                    length: 5,
                  }).map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      className={
                        index < roundedRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300 dark:text-slate-600"
                      }
                    />
                  ))}
                </div>

                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {rating > 0 ? `${rating.toFixed(1)} / 5` : "No ratings yet"}
                </span>
              </div>

              {/* Price */}

              <div className="mt-7">
                <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  ₹{formattedPrice}
                </span>
              </div>

              {/* Description */}

              <div className="mt-7">
                <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">
                  Product Description
                </h2>

                <p className="whitespace-pre-line text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                  {product.description}
                </p>
              </div>

              {/* Stock */}

              <div className="mt-7">
                {isAvailable ? (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <PackageCheck size={18} />

                    <span>In Stock</span>

                    <span className="text-emerald-600/70 dark:text-emerald-400/70">
                      •
                    </span>

                    <span>{safeStock} available</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-400">
                    <PackageX size={18} />
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Quantity */}

              {isAvailable && (
                <div className="mt-7">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Quantity
                    </span>

                    <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                        className="flex h-11 w-11 items-center justify-center text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-slate-700"
                      >
                        <Minus size={17} />
                      </button>

                      <span
                        className="flex h-11 min-w-14 items-center justify-center border-x border-slate-200 px-3 text-sm font-bold dark:border-slate-700"
                        aria-live="polite"
                      >
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={increaseQuantity}
                        disabled={quantity >= safeStock}
                        aria-label="Increase quantity"
                        className="flex h-11 w-11 items-center justify-center text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-slate-700"
                      >
                        <Plus size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================
                  ACTION BUTTONS
              =================================================== */}

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Add To Cart */}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!isAvailable || adding || buying}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  <ShoppingCart size={19} />

                  {adding ? "Adding..." : "Add to Cart"}
                </button>

                {/* Buy Now */}

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!isAvailable || buying || adding}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Zap size={19} className="fill-current" />

                  {buying ? "Processing..." : "Buy Now"}
                </button>
              </div>

              {/* ==================================================
                  TRUST FEATURES
              =================================================== */}

              <div className="mt-8 grid grid-cols-1 gap-3 border-t border-slate-200 pt-7 sm:grid-cols-3 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Secure Shopping
                    </p>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Safe checkout
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <Truck size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Reliable Delivery
                    </p>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Across India
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                    <PackageCheck size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Quality Products
                    </p>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Carefully packed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
