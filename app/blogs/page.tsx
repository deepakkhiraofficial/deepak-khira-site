"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Script from "next/script";

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

// ======================= MOCK DATA =======================
const MOCK_POSTS: Post[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `post-${i + 1}`,
  title: `Sample Blog Post #${i + 1}`,
  excerpt:
    "This is a short excerpt for the blog post. It shows what the article is about and entices the reader to click through.",
  content:
    "Full content of the post goes here. In a real app you would fetch this from your CMS or API. This demo stores content locally.",
  image: `/images/blog-${(i % 6) + 1}.jpg`,
  category: ["Tech", "Business", "Marketing", "Lifestyle"][i % 4],
  tags: ["tips", "howto", i % 2 ? "deep" : "quick"],
  author: i % 3 === 0 ? "Deepak Kushwah" : "Team",
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  views: Math.floor(Math.random() * 2000),
}));

// ======================= AVATAR =======================
function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-medium"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg,#4f46e5,#06b6d4)`,
      }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

// ======================= POST CARD =======================
function PostCard({
  post,
  onRead,
  onEdit,
  onDelete,
}: {
  post: Post;
  onRead: (p: Post) => void;
  onEdit: (p: Post) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.article
      layout
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border"
    >
      <div className="relative">
        <Image
          src={post.image || "/images/featured-blog.jpg"}
          alt={post.title}
          width={600}
          height={400}
          className="w-full h-44 object-cover"
        />
        <div className="absolute top-3 left-3 bg-white/90 text-xs px-2 py-1 rounded-full font-medium">
          {post.category}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Avatar name={post.author} size={36} />
            <div className="text-sm">
              <div className="font-medium">{post.author}</div>
              <div className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {Math.max(
              1,
              Math.round((post.excerpt.split(" ").length / 200) * 2)
            )}{" "}
            min read
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-2 leading-tight">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            {post.tags.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-1 bg-gray-100 rounded-full"
              >
                #{t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRead(post)}
              className="text-sm px-3 py-1 rounded-full border text-indigo-600"
            >
              Read
            </button>
            <button
              onClick={() => onEdit(post)}
              className="text-sm px-3 py-1 rounded-full border"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(post.id)}
              className="text-sm px-3 py-1 rounded-full border text-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ======================= NEWSLETTER FORM =======================
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return alert("Please enter a valid email");
    setSent(true);
    setTimeout(() => setSent(false), 1500);
    setEmail("");
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="px-3 py-2 border rounded-md"
      />
      <button
        type="submit"
        className="px-3 py-2 rounded-md bg-indigo-600 text-white"
      >
        {sent ? "Subscribed" : "Subscribe"}
      </button>
    </form>
  );
}

// ======================= BLOG PAGE =======================
export default function Blogs() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [loading, setLoading] = useState(true);
  const [openPost, setOpenPost] = useState<Post | null>(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setPosts(MOCK_POSTS);
      setLoading(false);
    }, 600);
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

  function handleDeletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      {/* SEO Structured Data */}
      <Script
        type="application/ld+json"
        id="blog-schema"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Deepak Khira Enterprises Blog",
          url: "https://yourdomain.com/blogs",
          description:
            "Practical guides and case studies on business, tech, and marketing.",
          publisher: {
            "@type": "Organization",
            name: "Deepak Khira Enterprises",
          },
        })}
      </Script>

      <div className="max-w-7xl mx-auto px-4">
        {/* Search & Hero */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-sky-500 to-teal-400 text-white p-10 mb-10 shadow-xl">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-extrabold leading-tight"
            >
              Insights & Stories
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-lg opacity-90"
            >
              Practical guides, deep dives and case studies — read, learn, and
              build with confidence.
            </motion.p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <input
                aria-label="Search blogs"
                placeholder="Search articles, topics or authors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-2/3 lg:w-1/2 rounded-full py-3 pl-4 pr-10 shadow-lg border-0 text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <main className="lg:col-span-2 space-y-6">
            {/* Post Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: pageSize }).map((_, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-2xl shadow animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paged.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onRead={(p) => setOpenPost(p)}
                    onEdit={() => {}}
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            <nav className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 rounded-md border bg-white shadow-sm"
              >
                Prev
              </button>
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  aria-current={page === i + 1 ? "page" : undefined}
                  className={`px-3 py-2 rounded-md ${page === i + 1 ? "bg-indigo-600 text-white" : "bg-white border"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                className="px-3 py-2 rounded-md border bg-white shadow-sm"
              >
                Next
              </button>
            </nav>
          </main>

          {/* SIDEBAR */}
          <aside className="space-y-6 lg:sticky lg:top-20">
            <div className="bg-white rounded-2xl p-4 border shadow">
              <h4 className="font-semibold mb-3">Trending</h4>
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
                      <div className="text-sm font-medium leading-tight">
                        {t.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {t.views} views •{" "}
                        {new Date(t.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border shadow">
              <h4 className="font-semibold mb-2">Subscribe</h4>
              <p className="text-sm text-gray-600 mb-3">
                Get weekly insights. No spam — unsubscribe anytime.
              </p>
              <NewsletterForm />
            </div>

            <div className="bg-white rounded-2xl p-4 border shadow">
              <h4 className="font-semibold mb-3">Popular Tags</h4>
              <div className="flex gap-2 flex-wrap">
                {allTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTags([t])}
                    className="px-3 py-1 text-sm bg-gray-100 rounded-full"
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Post Details Modal */}
      {openPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-3xl w-full bg-white rounded-2xl shadow-lg overflow-auto max-h-[90vh]"
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-semibold">{openPost.title}</h2>
                <button
                  onClick={() => setOpenPost(null)}
                  className="text-gray-500"
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
              <div className="mt-4 text-gray-700">
                <div className="text-sm text-gray-500">
                  By {openPost.author} •{" "}
                  {new Date(openPost.createdAt).toLocaleDateString()}
                </div>
                <div className="mt-3 leading-relaxed">{openPost.content}</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
