"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import SEO from "@/components/SEO";
import Navbar from "@/components/layout/Navbar";
import NewsletterForm from "@/components/sections/NewsletterForm";
import { MOCK_POSTS, Post } from "@/lib/mockPosts";
import PostCard from "@/components/blog/PostCard";

// ======================= Avatar Component =======================
interface AvatarProps {
  name: string;
  size?: number;
}
function Avatar({ name, size = 40 }: AvatarProps) {
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
  const bg = gradients[name.length % gradients.length];
  return (
    <div
      style={{ width: size, height: size, background: bg }}
      className="rounded-full flex items-center justify-center text-white font-bold"
    >
      {initials}
    </div>
  );
}

// ======================= Social Share =======================
function SocialShare({ url, title }: { url: string; title: string }) {
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);

  return (
    <div className="flex gap-3 mt-6">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-blue-400 text-white rounded hover:bg-blue-500"
      >
        Twitter
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?url=${shareUrl}&title=${shareTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-blue-800 text-white rounded hover:bg-blue-900"
      >
        LinkedIn
      </a>
    </div>
  );
}

// ======================= Blog Post Page =======================
export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug;

  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!slug) return;
    const found = MOCK_POSTS.find((p) => p.slug === slug);
    setPost(found || null);
  }, [slug]);

  // Related posts (same category or tag, excluding current)
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return MOCK_POSTS.filter(
      (p) =>
        p.id !== post.id &&
        (p.category === post.category ||
          p.tags.some((t) => post.tags.includes(t)))
    ).slice(0, 3);
  }, [post]);

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="py-20 text-center text-red-500 text-xl">
          Post not found!
        </div>
      </>
    );
  }

  const postUrl = `https://deepakkhiraenterprises.netlify.app/blogs/${post.slug}`;

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        url={postUrl}
        image={post.image}
        keywords={post.tags}
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          image: post.image
            ? `https://deepakkhiraenterprises.netlify.app${post.image}`
            : undefined,
          author: { "@type": "Person", name: post.author },
          datePublished: post.createdAt,
          description: post.excerpt,
          mainEntityOfPage: postUrl,
        }}
      />

      <Navbar />

      <main className="max-w-5xl mx-auto py-20 px-6 md:px-16 bg-gray-50 dark:bg-gray-900">
        {/* Post Header */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 mb-6">
          <Avatar name={post.author} />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {post.author} • {new Date(post.createdAt).toLocaleDateString()} •{" "}
            {Math.max(
              1,
              Math.round((post.excerpt.split(" ").length / 200) * 2)
            )}{" "}
            min read
          </div>
        </div>

        {/* Post Image */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full max-h-[400px] object-cover rounded-lg mb-6 shadow"
          />
        )}

        {/* Post Content */}
        <div className="prose dark:prose-invert max-w-full mb-6 text-gray-800 dark:text-gray-200">
          {post.content}
        </div>

        {/* Social Share */}
        <SocialShare url={postUrl} title={post.title} />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Related Posts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700">
          <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Subscribe
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Get weekly insights. No spam — unsubscribe anytime.
          </p>
          <NewsletterForm />
        </div>
      </main>
    </>
  );
}
