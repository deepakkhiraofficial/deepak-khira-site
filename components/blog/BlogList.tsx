import BlogCard from "./BlogCard";
import { motion } from "framer-motion";

const blogs = [
  {
    title: "Latest Web Trends",
    excerpt:
      "Discover the latest in web development and design trends that shape the future of the web.",
    slug: "latest-web-trends",
  },
  {
    title: "UX Best Practices",
    excerpt:
      "Improve user experience with these practical tips and techniques for better engagement.",
    slug: "ux-best-practices",
  },
  {
    title: "Mobile App Design",
    excerpt:
      "Design apps that users love, with intuitive interfaces and seamless experiences.",
    slug: "mobile-app-design",
  },
];

export default function BlogList() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
          Latest Blogs & Insights
        </h2>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <BlogCard {...blog} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
