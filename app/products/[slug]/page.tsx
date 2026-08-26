import ProductDetail from "./ProductDetail";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${apiUrl}/api/products/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return (
        <div className="py-20 text-center text-red-500">Product not found!</div>
      );
    }

    const data = await res.json();

    if (!data.success || !data.product) {
      return (
        <div className="py-20 text-center text-red-500">Product not found!</div>
      );
    }

    return <ProductDetail product={data.product} />;
  } catch (error) {
    console.error("PRODUCT PAGE ERROR:", error);

    return (
      <div className="py-20 text-center text-red-500">
        Failed to load product.
      </div>
    );
  }
}
