"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function EditProduct({ params }: any) {
  const id = params.id;
  const [product, setProduct] = useState<any>(null);

  async function loadProduct() {
    const res = await fetch("/api/products");
    const all = await res.json();
    const found = all.find((x: any) => x._id === id);
    setProduct(found);
  }

  useEffect(() => {
    loadProduct();
  }, []);

  const save = async () => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });

    if (res.ok) {
      alert("Product Updated");
      window.location.href = "/admin/products";
    }
  };

  if (!product) return "Loading...";

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Edit Product</h1>

      <input
        value={product.title}
        onChange={(e) => setProduct({ ...product, title: e.target.value })}
        className="w-full border p-2 rounded mb-3"
      />

      <input
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
        className="w-full border p-2 rounded mb-3"
      />

      <input
        value={product.stock}
        onChange={(e) => setProduct({ ...product, stock: e.target.value })}
        className="w-full border p-2 rounded mb-3"
      />

      <Button onClick={save} className="w-full">
        Save
      </Button>
    </div>
  );
}
