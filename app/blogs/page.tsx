"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import NewsletterForm from "@/components/sections/NewsletterForm";

// ======================= TYPES =======================
type Post = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  views?: number;
};

// ======================= MOCK DATA (5 POSTS) =======================
const MOCK_POSTS: Post[] = Array.from({ length: 5 }).map((_, i) => ({
  id: `post-${i + 1}`,
  title: `Sample Blog Post #${i + 1}`,
  excerpt:
    "This is a short excerpt for the blog post. It shows what the article is about and entices the reader to click through.",
  content:
    "Full content of the post goes here. In a real app you would fetch this from your CMS or API. This demo stores content locally.",
  image: `/images/blog-${(i % 5) + 1}.jpg`,
  category: ["Tech", "Business", "Trading", "Marketing", "Content Creation"][
    i % 5
  ],
  tags: ["tips", "howto", i % 2 ? "deep" : "quick"],
  author: i % 3 === 0 ? "Deepak Kushwah" : "Team",
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  views: Math.floor(Math.random() * 2000),
}));

// ======================= AVATAR =======================
interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export function Avatar({ name, size = 32, className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const gradients = [
    "linear-gradient(135deg,#4f46e5,#06b6d4)",
    "linear-gradient(135deg,#f59e0b,#ef4444)",
    "linear-gradient(135deg,#10b981,#3b82f6)",
    "linear-gradient(135deg,#8b5cf6,#ec4899)",
    "linear-gradient(135deg,#facc15,#f97316)",
  ];
  const bgGradient = gradients[name.length % gradients.length];

  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-semibold text-sm transition-transform transform hover:scale-110 hover:shadow-lg ${className}`}
      style={{ width: size, height: size, background: bgGradient }}
      title={name}
      aria-hidden="false"
    >
      {initials}
    </div>
  );
}

// ======================= POST CARD =======================
function PostCard({ post, onRead }: { post: Post; onRead: (p: Post) => void }) {
  return (
    <motion.article
      layout
      whileHover={{ scale: 1.03 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border dark:border-gray-700 transition-transform"
    >
      <div className="relative">
        <Image
          src={post.image || "/images/featured-blog.jpg"}
          alt={post.title}
          width={600}
          height={400}
          className="w-full h-44 object-cover"
        />
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-700/80 text-xs px-2 py-1 rounded-full font-medium">
          {post.category}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Avatar name={post.author} size={36} />
            <div className="text-sm">
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {post.author}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {Math.max(
              1,
              Math.round((post.excerpt.split(" ").length / 200) * 2)
            )}{" "}
            min read
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
          {post.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {post.excerpt}
        </p>
        <button
          onClick={() => onRead(post)}
          className="text-sm px-3 py-1 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
        >
          Read More
        </button>
      </div>
    </motion.article>
  );
}

// ======================= BLOG PAGE =======================
export default function Blogs() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 4; // show 4 posts per page
  const [loading, setLoading] = useState(true);
  const [openPost, setOpenPost] = useState<Post | null>(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setPosts(MOCK_POSTS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts]
  );

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))),
    [posts]
  );

  const filtered = useMemo(() => {
    let res = posts.slice();
    if (category !== "All") res = res.filter((p) => p.category === category);
    if (search.trim()) {
      const s = search.toLowerCase();
      res = res.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.excerpt.toLowerCase().includes(s)
      );
    }
    if (selectedTags.length)
      res = res.filter((p) => selectedTags.every((t) => p.tags.includes(t)));
    return res;
  }, [posts, category, search, selectedTags]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page]
  );

  const trending = useMemo(
    () =>
      posts
        .slice()
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5),
    [posts]
  );

  return (
    <>
      <Navbar />

      {/* JSON-LD Structured Data */}
      <Script type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Deepak Khira Enterprises Blog",
          url: "https://deepakkhiraenterprises.netlify.app/blogs",
          description:
            "Guides and insights on business, trading, online selling, content creation, video editing, and marketing.",
          publisher: {
            "@type": "Organization",
            name: "Deepak Khira Enterprises",
            logo: { "@type": "ImageObject", url: "/business_logo.png" },
          },
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            image: p.image || "/images/featured-blog.jpg",
            author: { "@type": "Person", name: p.author },
            datePublished: p.createdAt,
            description: p.excerpt,
          })),
        })}
      </Script>

      <main className="min-h-screen py-20 px-6 md:px-16 bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">
            Deepak Khira Enterprises Blog
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl">
            Guides, insights, and tutorials on business, trading, online
            selling, content creation, video editing, marketing, and resume
            building.
          </p>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="mt-6 w-full md:w-2/3 rounded-full px-4 py-3 shadow-lg border-0 text-gray-700 dark:bg-gray-700 dark:text-white"
          />
        </section>

        {/* Blog & Sidebar */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
          {/* Posts */}
          <main className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: pageSize }).map((_, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-2xl shadow animate-pulse dark:bg-gray-800"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {paged.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onRead={(p) => setOpenPost(p)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            <nav className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 rounded-md border bg-white dark:bg-gray-500 shadow"
              >
                Prev
              </button>
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  aria-current={page === i + 1 ? "page" : undefined}
                  className={`px-3 py-2 rounded-md ${
                    page === i + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-white dark:bg-gray-500 border"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                className="px-3 py-2 rounded-md border bg-white dark:bg-gray-500 shadow"
              >
                Next
              </button>
            </nav>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            {/* Trending */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border dark:border-gray-700 shadow">
              <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                Trending Posts
              </h4>
              <div className="space-y-3">
                {trending.map((t) => (
                  <div key={t.id} className="flex items-start gap-3">
                    <Image
                      src={t.image || "/images/featured-blog.jpg"}
                      width={56}
                      height={56}
                      alt={t.title}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {t.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t.views} views •{" "}
                        {new Date(t.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border dark:border-gray-700 shadow">
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Subscribe
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Get weekly insights. No spam — unsubscribe anytime.
              </p>
              <NewsletterForm />
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border dark:border-gray-700 shadow">
              <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                Popular Tags
              </h4>
              <div className="flex gap-2 flex-wrap">
                {allTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTags([t])}
                    className="px-3 py-1 text-sm bg-gray-100 font-bold dark:bg-gray-300 rounded-full"
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Post Modal */}
      {openPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-y-auto max-h-[90vh]"
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {openPost.title}
                </h2>
                <button
                  onClick={() => setOpenPost(null)}
                  className="text-gray-500 dark:text-gray-400"
                >
                  Close
                </button>
              </div>
              <Image
                src={openPost.image || "/images/featured-blog.jpg"}
                width={600}
                height={400}
                className="w-full h-64 object-cover mt-4 rounded-md"
                alt={openPost.title}
              />
              <div className="mt-4 text-gray-700 dark:text-gray-300">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  By {openPost.author} •{" "}
                  {new Date(openPost.createdAt).toLocaleDateString()}
                </div>
                <div className="mt-3 leading-relaxed">{openPost.content}</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
