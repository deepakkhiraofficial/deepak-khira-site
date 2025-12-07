import BlogCard from "./BlogCard";

const blogs = [
  {
    title: "Latest Web Trends",
    excerpt: "Discover the latest in web development...",
    slug: "latest-web-trends",
  },
  {
    title: "UX Best Practices",
    excerpt: "Improve user experience with these tips...",
    slug: "ux-best-practices",
  },
  {
    title: "Mobile App Design",
    excerpt: "Design apps that users love...",
    slug: "mobile-app-design",
  },
];

export default function BlogList() {
  return (
    <div className="grid md:grid-cols-3 gap-8 container mx-auto px-4">
      {blogs.map((blog) => (
        <BlogCard key={blog.slug} {...blog} />
      ))}
    </div>
  );
}
