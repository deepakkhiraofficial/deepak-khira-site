"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import SEO from "@/components/SEO";
import Navbar from "@/components/layout/Navbar";
import NewsletterForm from "@/components/sections/NewsletterForm";
import { motion } from "framer-motion";

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

// ======================= MOCK POSTS =======================
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

// ======================= PAGE COMPONENT =======================
export default function BlogPostPage() {
  const { slug } = useParams();

  // Find the post based on slug
  const post = MOCK_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Post not found</h1>
      </main>
    );
  }

  return (
    <>
      {/* Dynamic SEO */}
      <SEO
        title={`${post.title} | Deepak Khira Enterprises`}
        description={post.excerpt}
        url={`https://deepak-khira-enterprises.com/blogs/${post.slug}`}
        image={post.image || "/images/featured-blog.jpg"}
        keywords={post.tags}
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          image: post.image
            ? `https://deepak-khira-enterprises.com${post.image}`
            : "https://deepak-khira-enterprises.com/images/featured-blog.jpg",
          author: { "@type": "Person", name: post.author },
          datePublished: post.createdAt,
          description: post.excerpt,
          url: `https://deepak-khira-enterprises.com/blogs/${post.slug}`,
        }}
      />

      <Navbar />

      <main className="min-h-screen py-20 px-6 md:px-16 bg-gray-50 dark:bg-gray-900 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-6">
          {post.title}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>
        <div className="flex items-center gap-3 mb-6">
          <div className="font-medium text-gray-800 dark:text-gray-200">
            {post.author}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>

        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={400}
            className="w-full h-auto rounded-lg mb-6"
          />
        )}

        <article className="prose dark:prose-invert max-w-full">
          {post.content}
        </article>

        {/* Newsletter */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-5 border dark:border-gray-700 shadow">
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
