"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/utils/categories";
import validateProduct from "@/utils/validateProduct";

export default function ProductForm({ product: initialProduct }) {
  const router = useRouter();

  const [product, setProduct] = useState({
    name: initialProduct?.name || "",
    slug: initialProduct?.slug || "",
    description: initialProduct?.description || "",
    category: initialProduct?.category || "",
    price: initialProduct?.price || 0,
    stock: initialProduct?.stock || 0,
    images: initialProduct?.images || [],
    featured: initialProduct?.featured || false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setProduct({ ...product, [name]: type === "checkbox" ? checked : value });
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImageFile(e.target.files[0]);
  };

  // Upload image to server or cloud (mock for now)
  const uploadImage = async (file: File) => {
    // For production, use Cloudinary/S3
    const reader = new FileReader();
    return new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateProduct(product);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      let images = product.images;
      if (imageFile) {
        const uploaded = await uploadImage(imageFile);
        images = [uploaded];
      }

      const payload = { ...product, images };

      const method = initialProduct ? "PUT" : "POST";
      const endpoint = initialProduct
        ? `/api/admin/products/${initialProduct._id}`
        : `/api/admin/products`;

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save product");

      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Error saving product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md">
      <div>
        <label className="block mb-1 font-semibold">Name</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <label className="block mb-1 font-semibold">Slug</label>
        <input
          type="text"
          name="slug"
          value={product.slug}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}
      </div>

      <div>
        <label className="block mb-1 font-semibold">Description</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={4}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>

      <div>
        <label className="block mb-1 font-semibold">Category</label>
        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-semibold">Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
      </div>

      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          name="featured"
          checked={product.featured}
          onChange={handleChange}
          id="featured"
        />
        <label htmlFor="featured">Featured Product</label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {initialProduct ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}
