"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Image as ImageIcon,
  Package,
  Save,
  Tag,
} from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";


type ProductForm = {
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  images: string[];
  featured: boolean;
  status: "active" | "draft";
};

export default function CreateProductPage() {
  const router = useRouter();

  const [product, setProduct] = useState<ProductForm>({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "0",
    images: [],
    featured: false,
    status: "active",
  });

  const [loading, setLoading] = useState(false);

  const updateField = <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!product.name.trim()) {
      toast.error("Product name is required.");
      return;
    }

    if (!product.description.trim()) {
      toast.error("Product description is required.");
      return;
    }

    if (!product.category.trim()) {
      toast.error("Product category is required.");
      return;
    }

    const price = Number(product.price);
    const stock = Number(product.stock);

    if (!Number.isFinite(price) || price < 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    if (!Number.isFinite(stock) || stock < 0) {
      toast.error("Please enter a valid stock quantity.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: product.name.trim(),
          description: product.description.trim(),
          category: product.category.trim(),
          price,
          stock,
          images: product.images,
          featured: product.featured,
          status: product.status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || data.error || "Failed to create product"
        );
      }

      toast.success("Product created successfully!");

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/products"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Create Product
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Add a new product to your online store.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* =================================================
              MAIN INFORMATION
          ================================================= */}

          <div className="space-y-6 xl:col-span-2">
            {/* BASIC INFORMATION */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Package size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Basic Information
                    </h2>

                    <p className="text-xs text-slate-500">
                      Product details visible to customers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-5">
                {/* NAME */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Product Name
                  </label>

                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="e.g. Premium Bluetooth Speaker 10W"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Description
                  </label>

                  <textarea
                    value={product.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Describe your product, features, benefits and important details..."
                    rows={6}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    required
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Minimum 10 characters.
                  </p>
                </div>

                {/* CATEGORY */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category
                  </label>

                  <div className="relative">
                    <Tag
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={product.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      placeholder="e.g. Electronics"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* PRICING + INVENTORY */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <h2 className="font-semibold text-slate-900">
                  Pricing & Inventory
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
                {/* PRICE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Selling Price (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={product.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                </div>

                {/* STOCK */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={product.stock}
                    onChange={(e) => updateField("stock", e.target.value)}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                </div>
              </div>
            </section>

            {/* IMAGES */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <ImageIcon size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Product Images
                    </h2>

                    <p className="text-xs text-slate-500">
                      Add product images for your store.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* IMPORTANT:
                    Your ImageUploader should return
                    a URL.
                */}

                <ImageUploader
                  value={product.images[0] || ""}
                  onChange={(url) => updateField("images", url ? [url] : [])}
                />

                {product.images.length > 0 && (
                  <p className="mt-3 break-all text-xs text-emerald-600">
                    Image uploaded successfully.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <div className="space-y-6">
            {/* STATUS */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-slate-900">
                Product Status
              </h2>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
                  <input
                    type="radio"
                    name="status"
                    checked={product.status === "active"}
                    onChange={() => updateField("status", "active")}
                    className="mt-1"
                  />

                  <div>
                    <p className="text-sm font-medium text-slate-900">Active</p>

                    <p className="text-xs text-slate-500">
                      Product will be visible in the store.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
                  <input
                    type="radio"
                    name="status"
                    checked={product.status === "draft"}
                    onChange={() => updateField("status", "draft")}
                    className="mt-1"
                  />

                  <div>
                    <p className="text-sm font-medium text-slate-900">Draft</p>

                    <p className="text-xs text-slate-500">
                      Keep product hidden until ready.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* FEATURED */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={product.featured}
                  onChange={(e) => updateField("featured", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Featured Product
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Highlight this product in featured sections of your website.
                  </p>
                </div>
              </label>
            </section>

            {/* CREATE */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />

                {loading ? "Creating Product..." : "Create Product"}
              </button>

              <Link
                href="/admin/products"
                className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </Link>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
}
