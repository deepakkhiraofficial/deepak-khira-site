import ProductForm from "@/components/admin/ProductForm";

export default function AddProductPage() {
  return (
    <section className="max-w-4xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <ProductForm product={undefined} />
    </section>
  );
}
