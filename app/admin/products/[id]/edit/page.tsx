"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

// ============================================================
// TYPES
// ============================================================

type ProductForm = {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  featured: boolean;
  status: "active" | "draft";
};

// ============================================================
// INITIAL STATE
// ============================================================

const initialProduct: ProductForm = {
  name: "",
  description: "",
  category: "",
  price: 0,
  stock: 0,
  images: [],
  featured: false,
  status: "active",
};

// ============================================================
// PAGE
// ============================================================

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = typeof params?.id === "string" ? params.id : "";

  // ==========================================================
  // STATE
  // ==========================================================

  const [product, setProduct] = useState<ProductForm>(initialProduct);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  // ==========================================================
  // FETCH PRODUCT
  // ==========================================================

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/admin/products/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load product");
        }

        if (!data.product) {
          throw new Error("Product data not found.");
        }

        if (!cancelled) {
          setProduct({
            name: data.product.name || "",
            description: data.product.description || "",
            category: data.product.category || "",
            price: Number(data.product.price) || 0,
            stock: Number(data.product.stock) || 0,
            images: Array.isArray(data.product.images)
              ? data.product.images
              : [],
            featured: Boolean(data.product.featured),
            status: data.product.status === "draft" ? "draft" : "active",
          });
        }
      } catch (error: unknown) {
        console.error("EDIT PRODUCT FETCH ERROR:", error);

        if (!cancelled) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load product"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ==========================================================
  // FIELD UPDATE
  // ==========================================================

  const updateField = <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==========================================================
  // IMAGE UPLOAD
  // ==========================================================

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Reset input so same file can be selected again
    e.target.value = "";

    if (!file) {
      return;
    }

    // --------------------------------------------------------
    // FILE TYPE
    // --------------------------------------------------------

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP and GIF images are allowed.");
      return;
    }

    // --------------------------------------------------------
    // FILE SIZE
    // --------------------------------------------------------

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      const res = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // Your upload API returns:
      // { url: "..." }

      if (!res.ok || !data.url) {
        throw new Error(data.message || "Image upload failed.");
      }

      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, data.url],
      }));

      toast.success("Image uploaded successfully.");
    } catch (error: unknown) {
      console.error("EDIT IMAGE UPLOAD ERROR:", error);

      toast.error(
        error instanceof Error ? error.message : "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  // ==========================================================
  // REMOVE IMAGE
  // ==========================================================

  const removeImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ==========================================================
  // DELETE PRODUCT
  // ==========================================================

  const handleDeleteProduct = async () => {
    if (!id) {
      toast.error("Product ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete product");
      }

      toast.success(data.message || "Product deleted successfully!");

      router.push("/admin/products");
      router.refresh();
    } catch (error: unknown) {
      console.error("DELETE PRODUCT ERROR:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to delete product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // UPDATE PRODUCT
  // ==========================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --------------------------------------------------------
    // BASIC CHECK
    // --------------------------------------------------------

    if (!id) {
      toast.error("Product ID is missing.");
      return;
    }

    // --------------------------------------------------------
    // NORMALIZE
    // --------------------------------------------------------

    const name = product.name.trim();

    const description = product.description.trim();

    const category = product.category.trim();

    const price = Number(product.price);

    const stock = Number(product.stock);

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (name.length < 2) {
      toast.error("Product name must be at least 2 characters.");
      return;
    }

    if (name.length > 200) {
      toast.error("Product name cannot exceed 200 characters.");
      return;
    }

    if (description.length < 10) {
      toast.error("Product description must be at least 10 characters.");
      return;
    }

    if (category.length < 2) {
      toast.error("Product category is required.");
      return;
    }

    if (!Number.isFinite(price)) {
      toast.error("Please enter a valid product price.");
      return;
    }

    if (price < 0) {
      toast.error("Product price cannot be negative.");
      return;
    }

    if (!Number.isFinite(stock)) {
      toast.error("Please enter a valid stock quantity.");
      return;
    }

    if (stock < 0) {
      toast.error("Stock cannot be negative.");
      return;
    }

    if (!Number.isInteger(stock)) {
      toast.error("Stock must be a whole number.");
      return;
    }

    if (
      product.images.some((image) => typeof image !== "string" || !image.trim())
    ) {
      toast.error("One or more product images are invalid.");
      return;
    }

    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    try {
      setSaving(true);

      const payload: ProductForm = {
        name,
        description,
        category,
        price,
        stock,
        images: product.images,
        featured: Boolean(product.featured),
        status: product.status === "draft" ? "draft" : "active",
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update product");
      }

      toast.success(data.message || "Product updated successfully!");

      router.push("/admin/products");
      router.refresh();
    } catch (error: unknown) {
      console.error("UPDATE PRODUCT ERROR:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="text-slate-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="mx-auto max-w-5xl">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>

          <p className="mt-1 text-sm text-slate-500">
            Update your product information, pricing, stock and images.
          </p>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={() => router.push("/admin/products")}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          ← Back to Products
        </button>
      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ===================================================
            BASIC INFORMATION
        =================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-900">
            Basic Information
          </h2>

          <div className="space-y-5">
            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Product Name
              </label>

              <input
                type="text"
                value={product.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter product name"
                maxLength={200}
                disabled={saving}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

              <p className="mt-1 text-xs text-slate-500">
                {product.name.length}/200
              </p>
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                value={product.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Enter product description"
                rows={6}
                disabled={saving}
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

              <p className="mt-1 text-xs text-slate-500">
                {product.description.length} characters
              </p>
            </div>

            {/* CATEGORY */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>

              <input
                type="text"
                value={product.category}
                onChange={(e) => updateField("category", e.target.value)}
                placeholder="e.g. Electronics"
                disabled={saving}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            PRICING & INVENTORY
        =================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-900">
            Pricing & Inventory
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* PRICE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Price (₹)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={product.price}
                onChange={(e) => updateField("price", Number(e.target.value))}
                disabled={saving}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            {/* STOCK */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Stock
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={product.stock}
                onChange={(e) => updateField("stock", Number(e.target.value))}
                disabled={saving}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

              <p className="mt-1 text-xs text-slate-500">
                {product.stock > 0
                  ? "Product is in stock"
                  : "Product is out of stock"}
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================
            IMAGES
        =================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Product Images
              </h2>

              <p className="text-sm text-slate-500">Upload product images.</p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {product.images.length} image
              {product.images.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* IMAGE GRID */}

          {product.images.length > 0 && (
            <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {product.images.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="group relative overflow-hidden rounded-xl border bg-slate-50"
                >
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />

                  <button
                    type="button"
                    disabled={saving || uploading}
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 rounded-lg bg-red-600 px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove
                  </button>

                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 rounded-lg bg-black/70 px-2 py-1 text-xs text-white">
                      Main Image
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* UPLOAD */}

          <label
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50 ${
              uploading || saving ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <span className="mb-2 text-3xl">📷</span>

            <span className="font-medium text-slate-700">
              {uploading ? "Uploading..." : "Upload Image"}
            </span>

            <span className="mt-1 text-xs text-slate-500">
              JPG, PNG, WEBP or GIF · Max 5MB
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={uploading || saving}
              onChange={handleImageUpload}
            />
          </label>
        </section>

        {/* ===================================================
            PRODUCT SETTINGS
        =================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-900">
            Product Settings
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* STATUS */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                value={product.status}
                onChange={(e) =>
                  updateField("status", e.target.value as "active" | "draft")
                }
                disabled={saving}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              >
                <option value="active">Active</option>

                <option value="draft">Draft</option>
              </select>
            </div>

            {/* FEATURED */}

            <div className="flex items-center">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={product.featured}
                  onChange={(e) => updateField("featured", e.target.checked)}
                  disabled={saving}
                  className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />

                <span>
                  <span className="block font-medium text-slate-800">
                    Featured Product
                  </span>

                  <span className="text-xs text-slate-500">
                    Show this product in featured sections.
                  </span>
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* DELETE */}

          <button
            type="button"
            disabled={saving || uploading}
            onClick={handleDeleteProduct}
            className="rounded-xl border border-red-200 bg-red-50 px-6 py-3 font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete Product
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* CANCEL */}

            <button
              type="button"
              disabled={saving || uploading}
              onClick={() => router.push("/admin/products")}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            {/* SAVE */}

            <button
              type="submit"
              disabled={saving || uploading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
