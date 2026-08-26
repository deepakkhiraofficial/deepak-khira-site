"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm({ product }) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    price: 0,
    stock: 0,
    images: [""],
  });
  const router = useRouter();

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = product ? "PUT" : "POST";
    const url = product
      ? `/api/admin/products/${product._id}`
      : "/api/admin/products";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) router.push("/admin/products");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Product Name"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="slug"
        value={form.slug}
        onChange={handleChange}
        placeholder="Slug (unique)"
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        name="stock"
        value={form.stock}
        onChange={handleChange}
        placeholder="Stock"
        className="w-full p-2 border rounded"
        required
      />
      <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        {product ? "Update" : "Add"} Product
      </button>
    </form>
  );
}
