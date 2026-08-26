"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";

interface Product {
  _id: string;
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
}

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);

  const image =
    product.images?.length > 0 ? product.images[0] : "/placeholder-product.png";

  const isAvailable =
    product.status === "active" && product.inStock && product.stock > 0;

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  };

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = async () => {
    if (!isAvailable) {
      toast.error("Product is currently out of stock.");
      return;
    }

    try {
      setAdding(true);

      addToCart(product, quantity);

      toast.success(`${quantity} × ${product.name} added to cart`);
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);
      toast.error("Unable to add product to cart.");
    } finally {
      setAdding(false);
    }
  };

  // =========================================================
  // BUY NOW
  // =========================================================

  const handleBuyNow = async () => {
    if (!isAvailable) {
      toast.error("Product is currently out of stock.");
      return;
    }

    try {
      setBuying(true);

      // Add product to cart first
      addToCart(product, quantity);

      // Then go to cart
      router.push("/cart");
    } catch (error) {
      console.error("BUY NOW ERROR:", error);
      toast.error("Unable to proceed.");
      setBuying(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900 lg:grid-cols-2 lg:p-8">
          {/* ================================================= */}
          {/* IMAGE */}
          {/* ================================================= */}

          <div className="flex min-h-[400px] items-center justify-center overflow-hidden rounded-2xl bg-gray-100 p-6 dark:bg-slate-800">
            <img
              src={image}
              alt={product.name}
              className="max-h-[520px] w-full object-contain"
            />
          </div>

          {/* ================================================= */}
          {/* PRODUCT INFO */}
          {/* ================================================= */}

          <div className="flex flex-col justify-center">
            {/* Category */}

            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-blue-600">
              {product.category}
            </p>

            {/* Name */}

            <h1 className="text-3xl font-bold leading-tight text-slate-900 dark:text-white sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}

            <div className="mt-4 flex items-center gap-3">
              <div className="text-yellow-500">
                {product.rating > 0
                  ? "★".repeat(Math.round(product.rating))
                  : "☆"}
              </div>

              <span className="text-sm text-gray-500">
                {product.rating > 0 ? `${product.rating}/5` : "No ratings yet"}
              </span>
            </div>

            {/* Price */}

            <div className="mt-6">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Description */}

            <div className="mt-6">
              <h2 className="mb-2 text-lg font-bold">Product Description</h2>

              <p className="leading-7 text-gray-600 dark:text-gray-300">
                {product.description}
              </p>
            </div>

            {/* Stock */}

            <div className="mt-6">
              {isAvailable ? (
                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  In Stock • {product.stock} available
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quantity */}

            {isAvailable && (
              <div className="mt-6 flex items-center gap-4">
                <span className="font-semibold">Quantity</span>

                <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="px-4 py-2 text-xl transition hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-slate-800"
                  >
                    −
                  </button>

                  <span className="min-w-12 px-4 text-center font-semibold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="px-4 py-2 text-xl transition hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-slate-800"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* ================================================= */}
            {/* ACTION BUTTONS */}
            {/* ================================================= */}

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* ADD TO CART */}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isAvailable || adding}
                className="rounded-xl bg-slate-900 px-6 py-3.5 font-bold text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {adding ? "Adding..." : "Add to Cart"}
              </button>

              {/* BUY NOW */}

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!isAvailable || buying}
                className="rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {buying ? "Processing..." : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
