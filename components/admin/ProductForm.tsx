"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

// ============================================================
// TYPES
// ============================================================

interface Product {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images?: string[];
}

interface ProductFormProps {
  product?: Product | null;
}

interface ProductFormState {
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
}

// ============================================================
// COMPONENT
// ============================================================

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<ProductFormState>({
    name: "",
    slug: "",
    description: "",
    category: "",
    price: 0,
    stock: 0,
    images: [""],
  });

  const [saving, setSaving] = useState(false);

  // ==========================================================
  // LOAD PRODUCT FOR EDIT
  // ==========================================================

  useEffect(() => {
    if (!product) {
      return;
    }

    setForm({
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      category: product.category || "",
      price: Number(product.price) || 0,
      stock: Number(product.stock) || 0,
      images:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : [""],
    });
  }, [product]);

  // ==========================================================
  // HANDLE INPUT CHANGE
  // ==========================================================

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "price") {
        return {
          ...prev,
          price: Number(value) || 0,
        };
      }

      if (name === "stock") {
        return {
          ...prev,
          stock: Number(value) || 0,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // ==========================================================
  // HANDLE SUBMIT
  // ==========================================================

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    try {
      setSaving(true);

      const method = product ? "PUT" : "POST";

      const url = product?._id
        ? `/api/admin/products/${product._id}`
        : "/api/admin/products";

      const cleanedImages = form.images
        .map((image) => image.trim())
        .filter(Boolean);

      const payload = {
        ...form,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        images: cleanedImages,
      };

      const res = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message = "Unable to save product.";

        try {
          const data = await res.json();

          if (data?.message) {
            message = data.message;
          }
        } catch {
          // Ignore invalid JSON response
        }

        throw new Error(message);
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error: unknown) {
      console.error("PRODUCT FORM ERROR:", error);

      alert(error instanceof Error ? error.message : "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      {/* PRODUCT NAME */}

      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Product Name"
        className="w-full rounded border p-2"
        required
        disabled={saving}
      />

      {/* SLUG */}

      <input
        type="text"
        name="slug"
        value={form.slug}
        onChange={handleChange}
        placeholder="Slug (unique)"
        className="w-full rounded border p-2"
        required
        disabled={saving}
      />

      {/* DESCRIPTION */}

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full rounded border p-2"
        rows={5}
        required
        disabled={saving}
      />

      {/* CATEGORY */}

      <input
        type="text"
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        className="w-full rounded border p-2"
        required
        disabled={saving}
      />

      {/* PRICE */}

      <input
        type="number"
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full rounded border p-2"
        min="0"
        step="0.01"
        required
        disabled={saving}
      />

      {/* STOCK */}

      <input
        type="number"
        name="stock"
        value={form.stock}
        onChange={handleChange}
        placeholder="Stock"
        className="w-full rounded border p-2"
        min="0"
        step="1"
        required
        disabled={saving}
      />

      {/* IMAGE URL */}

      <input
        type="url"
        value={form.images[0] || ""}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            images: [e.target.value],
          }))
        }
        placeholder="Product Image URL"
        className="w-full rounded border p-2"
        disabled={saving}
      />

      {/* SUBMIT */}

      <button
        type="submit"
        disabled={saving}
        className="rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving
          ? product
            ? "Updating..."
            : "Adding..."
          : product
            ? "Update Product"
            : "Add Product"}
      </button>
    </form>
  );
}
