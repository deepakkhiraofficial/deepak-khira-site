import Link from "next/link";

interface BlogCardProps {
  title: string;
  excerpt: string;
  slug: string;
}

export default function BlogCard({ title, excerpt, slug }: BlogCardProps) {
  return (
    <div className="border p-6 rounded-lg shadow hover:shadow-lg transition">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="mb-4">{excerpt}</p>
      <Link href={`/blogs/${slug}`} className="text-blue-600 hover:underline">
        Read More
      </Link>
    </div>
  );
}
