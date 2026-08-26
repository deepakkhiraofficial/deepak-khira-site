"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  const [product, setProduct] = useState({
    name: "",
    price: 0,
    stock: 0,
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch existing product details
  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Product not found");

        setProduct({
          name: data.name,
          price: data.price,
          stock: data.stock,
          category: data.category || "",
          image: data.image || "",
        });
      } catch (err: any) {
        toast.error(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  // Handle product update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update product");

      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-xl animate-pulse text-gray-700">
          Loading product...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        {/* Price */}
        <input
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: +e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        {/* Stock */}
        <input
          type="number"
          placeholder="Stock"
          value={product.stock}
          onChange={(e) => setProduct({ ...product, stock: +e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        {/* Category */}
        <input
          type="text"
          placeholder="Category"
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
          className="w-full p-2 border rounded"
        />

        {/* Image Upload */}
        <ImageUploader
          value={product.image}
          onChange={(url) => setProduct({ ...product, image: url })}
        />

        <button
          type="submit"
          disabled={updating}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {updating ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
