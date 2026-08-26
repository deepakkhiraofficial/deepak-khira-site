// server component
import Product from "@/models/Product";
import connectDB from "@/lib/mongodb";

export default async function ServerCategories() {
  await connectDB();
  const categories = await Product.distinct("category");
  return (
    <script id="categories-json" type="application/json">
      {JSON.stringify(categories)}
    </script>
  );
}
