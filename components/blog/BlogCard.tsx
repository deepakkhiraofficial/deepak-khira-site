import Link from "next/link";

interface BlogCardProps {
  title: string;
  excerpt: string;
  slug: string;
}

export default function BlogCard({ title, excerpt, slug }: BlogCardProps) {
  return (
    <article className="border rounded-lg shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 duration-300 p-6 bg-white dark:bg-gray-800">
      <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="mb-4 text-gray-700 dark:text-gray-300 line-clamp-3">
        {excerpt}
      </p>

      <Link
        href={`/blogs/${slug}`}
        className="inline-block text-blue-600 hover:text-blue-800 hover:underline font-medium"
      >
        Read More →
      </Link>
    </article>
  );
}
