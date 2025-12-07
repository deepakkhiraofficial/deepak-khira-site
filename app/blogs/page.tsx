"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/**
 * Full_Blog_Page.tsx (Enhanced UI)
 * - Polished visual design (gradients, rounded cards, subtle shadows)
 * - Author avatars, read-time, improved tags, sticky sidebar
 * - Better pagination UI and accessible buttons
 * - Minor accessibility and responsive improvements
 *
 * Drop into Next.js App Router. Requires: tailwindcss, framer-motion
 */

type Post = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string; // ISO
  views?: number;
};

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

function IconSearch() {
  return (
    <svg
      className="w-5 h-5 text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M21 21l-4.35-4.35"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="11"
        cy="11"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

export default function Blogs() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [loading, setLoading] = useState(true);
  const [openPost, setOpenPost] = useState<Post | null>(null);
  const [showAdminEditor, setShowAdminEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

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
  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [pageCount]);

  const paged = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page]
  );

  function handleSavePost(payload: Partial<Post> & { id?: string }) {
    if (payload.id) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === payload.id ? { ...p, ...(payload as Post) } : p
        )
      );
    } else {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        title: payload.title || "Untitled",
        excerpt: payload.excerpt || "",
        content: payload.content || "",
        image: payload.image || "/images/featured-blog.jpg",
        category: payload.category || "General",
        tags: payload.tags || [],
        author: payload.author || "Admin",
        createdAt: new Date().toISOString(),
        views: 0,
      };
      setPosts((prev) => [newPost, ...prev]);
    }
    setShowAdminEditor(false);
    setEditingPost(null);
  }

  function handleDeletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  const trending = useMemo(
    () =>
      posts
        .slice()
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5),
    [posts]
  );

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-sky-500 to-teal-400 text-white p-10 mb-10 shadow-xl">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-extrabold leading-tight"
            >
              Insights &amp; Stories
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <main className="lg:col-span-2">
            {/* Featured card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <article className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="/images/featured-blog.jpg"
                  alt="Featured"
                  className="w-full h-64 object-cover brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar name="Deepak Kushwah" size={44} />
                    <div>
                      <div className="text-sm font-medium">Deepak Kushwah</div>
                      <div className="text-xs opacity-80">
                        Business • {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                    Boost Your Business with Smart Digital Strategies
                  </h2>
                  <p className="mt-2 max-w-2xl opacity-90">
                    Discover how modern tools and techniques can elevate your
                    business performance and help you stay ahead.
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setOpenPost(MOCK_POSTS[0])}
                      className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-full shadow"
                    >
                      Read Article n{" "}
                    </button>
                    <button
                      onClick={() => {
                        setEditingPost(null);
                        setShowAdminEditor(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-white/10 text-white"
                    >
                      + New Post
                    </button>
                  </div>
                </div>
              </article>
            </motion.div>

            {/* Filters row */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-sm font-medium">Categories:</div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1 rounded-full text-sm transition ${category === cat ? "bg-white text-indigo-700 shadow" : "bg-white/60 text-gray-700"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500">Tags:</div>
                <div className="flex gap-2 flex-wrap">
                  {allTags.map((t) => {
                    const active = selectedTags.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() =>
                          setSelectedTags((prev) =>
                            prev.includes(t)
                              ? prev.filter((x) => x !== t)
                              : [...prev, t]
                          )
                        }
                        className={`px-3 py-1 rounded-full text-sm ${active ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}
                      >
                        #{t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Post grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: pageSize }).map((_, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-2xl shadow animate-pulse"
                  />
                ))}
              </div>
            ) : paged.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow">
                No posts found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paged.map((post) => (
                  <motion.article
                    key={post.id}
                    layout
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg border"
                  >
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
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
                            Math.round(
                              (post.excerpt.split(" ").length / 200) * 2
                            )
                          )}{" "}
                          min read
                        </div>
                      </div>

                      <h3 className="font-semibold text-lg mb-2 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {post.excerpt}
                      </p>

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
                            onClick={() => setOpenPost(post)}
                            className="text-sm px-3 py-1 rounded-full border text-indigo-600"
                          >
                            Read
                          </button>
                          <button
                            onClick={() => {
                              setEditingPost(post);
                              setShowAdminEditor(true);
                            }}
                            className="text-sm px-3 py-1 rounded-full border"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-sm px-3 py-1 rounded-full border text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            {/* Pagination */}
            <nav
              className="mt-8 flex items-center justify-center gap-2"
              aria-label="Pagination"
            >
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

          <aside className="space-y-6 lg:sticky lg:top-20">
            <div className="bg-white rounded-2xl p-4 border shadow">
              <h4 className="font-semibold mb-3">Trending</h4>
              <div className="space-y-3">
                {trending.map((t) => (
                  <div key={t.id} className="flex items-start gap-3">
                    <img
                      src={t.image}
                      className="w-14 h-14 object-cover rounded-md"
                      alt={t.title}
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

            <div className="bg-white rounded-2xl p-4 border shadow text-sm">
              <h4 className="font-semibold mb-2">About</h4>
              <p className="text-gray-600">
                We publish practical articles on product, marketing and
                engineering. Read, learn, and ship faster.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {openPost && (
        <PostDetailsModal post={openPost} onClose={() => setOpenPost(null)} />
      )}
      {showAdminEditor && (
        <AdminEditor
          post={editingPost}
          onClose={() => {
            setShowAdminEditor(false);
            setEditingPost(null);
          }}
          onSave={handleSavePost}
        />
      )}
    </section>
  );
}

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

function PostDetailsModal({
  post,
  onClose,
}: {
  post: Post;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-3xl w-full bg-white rounded-2xl shadow-lg overflow-auto max-h-[90vh]"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <button onClick={onClose} className="text-gray-500">
              Close
            </button>
          </div>
          <img
            src={post.image}
            className="w-full h-64 object-cover mt-4 rounded-md"
          />
          <div className="mt-4 text-gray-700">
            <div className="text-sm text-gray-500">
              By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className="mt-3 leading-relaxed">{post.content}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AdminEditor({
  post,
  onClose,
  onSave,
}: {
  post: Post | null;
  onClose: () => void;
  onSave: (p: Partial<Post> & { id?: string }) => void;
}) {
  const [title, setTitle] = useState(post?.title || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [category, setCategory] = useState(post?.category || "General");
  const [tags, setTags] = useState<string>((post?.tags || []).join(", "));

  useEffect(() => {
    setTitle(post?.title || "");
    setExcerpt(post?.excerpt || "");
    setContent(post?.content || "");
    setCategory(post?.category || "General");
    setTags((post?.tags || []).join(", "));
  }, [post]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Partial<Post> & { id?: string; tags?: string[] } = {
      id: post?.id,
      title,
      excerpt,
      content,
      category,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    onSave(payload as any);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.form
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onSubmit={handleSubmit}
        className="max-w-2xl w-full bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {post ? "Edit Post" : "New Post"}
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 rounded bg-indigo-600 text-white"
            >
              Save
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Excerpt"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tags, comma separated"
            className="w-full px-3 py-2 border rounded"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={6}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
      </motion.form>
    </div>
  );
}
