"use client";
import Image from "next/image";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import NewsletterForm from "@/components/sections/NewsletterForm";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SEO from "@/components/SEO";

// ======================= TYPES =======================
type Post = {
  id: string;
  title: string;
  slug: string;
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
const MOCK_POSTS: Post[] = Array.from({ length: 5 }).map((_, i) => ({
  id: `post-${i + 1}`,
  slug: `sample-blog-post-${i + 1}`,
  title: `Sample Blog Post #${i + 1}`,
  excerpt:
    "This is a short excerpt for the blog post. It shows what the article is about and entices the reader to click through.",
  content:
    "Full content of the post goes here. In a real app you would fetch this from your CMS or API.",
  image: `/images/blog-${(i % 5) + 1}.jpg`,
  category: ["Tech", "Business", "Trading", "Marketing", "Content Creation"][
    i % 5
  ],
  tags: ["tips", "howto", i % 2 ? "deep" : "quick"],
  author: i % 3 === 0 ? "Deepak Kushwah" : "Team",
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  views: Math.floor(Math.random() * 2000),
}));

// ======================= AVATAR COMPONENT =======================
interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
}

function Avatar({ name, size = 32, className = "" }: AvatarProps) {
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
const PostCard = ({ post }: { post: Post }) => {
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
          priority
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
        <a
          href={`/blogs/${post.slug}`}
          className="text-sm px-3 py-1 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
        >
          Read More
        </a>
      </div>
    </motion.article>
  );
}

// ======================= BLOGS PAGE =======================
export default function blogs() {
  const trending = [...MOCK_POSTS]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const categories = [
    "All",
    ...Array.from(new Set(MOCK_POSTS.map((p) => p.category))),
  ];
  const allTags = Array.from(new Set(MOCK_POSTS.flatMap((p) => p.tags)));

  return (
    <>
      {/* SEO */}
      <SEO
        title="Blog | Deepak Khira Enterprises"
        description="Explore articles, tutorials, and guides on web development, business, trading, content creation, marketing, and more by Deepak Khira Enterprises."
        url="https://deepak-khira-enterprises.com/blogs"
        image="/blog-banner.jpg"
        keywords={[
          "Deepak Khira Enterprises blog",
          "web development tutorials",
          "business guides",
          "trading tips",
          "content creation",
          "digital marketing",
          "online selling India",
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Deepak Khira Enterprises Blog",
          url: "https://deepak-khira-enterprises.com/blogs",
          description:
            "Guides and insights on web development, business, trading, content creation, video editing, marketing, and online selling.",
          publisher: {
            "@type": "Organization",
            name: "Deepak Khira Enterprises",
            logo: {
              "@type": "ImageObject",
              url: "https://deepak-khira-enterprises.com/logo.png",
            },
          },
          blogPost: MOCK_POSTS.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            image: p.image
              ? `https://deepak-khira-enterprises.com${p.image}`
              : "https://deepak-khira-enterprises.com/images/featured-blog.jpg",
            author: { "@type": "Person", name: p.author },
            datePublished: p.createdAt,
            description: p.excerpt,
            url: `https://deepak-khira-enterprises.com/blogs/${p.slug}`,
          })),
        }}
      />

      <Navbar />

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
        </section>

        {/* Posts Grid */}
        <section className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
          <main className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {MOCK_POSTS.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
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
                  <span
                    key={t}
                    className="px-3 py-1 text-sm bg-gray-100 font-bold dark:bg-gray-300 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
