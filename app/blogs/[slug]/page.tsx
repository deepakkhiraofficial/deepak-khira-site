export default function BlogPage({ params }: { params: { slug?: string } }) {
  const slug = params.slug ?? "unknown-blog";
  return (
    <section className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-6">{slug.replace(/-/g, " ")}</h1>
      <p className="text-lg">
        This is a placeholder for the blog content of &quot;{slug}&quot;
      </p>
    </section>
  );
}
