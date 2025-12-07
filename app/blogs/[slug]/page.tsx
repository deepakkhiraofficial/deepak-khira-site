// app/blogs/[slug]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";

// MOCK: Replace with real fetch from CMS or DB
const MOCK_POSTS = [
  {
    slug: "sample-post-1",
    title: "Sample Post 1",
    content: "Full content goes here.",
    image: "/images/blog-1.jpg",
    author: "Deepak Kushwah",
    createdAt: "2025-12-07T00:00:00.000Z",
  },
];

interface PageProps {
  params: { slug: string };
}

export default function Page({ params }: PageProps) {
  const post = MOCK_POSTS.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <main className="min-h-screen py-20 px-6 md:px-16 bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <article className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          {post.title}
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
        </div>
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={400}
            className="w-full h-auto rounded-lg mb-4 object-cover"
          />
        )}
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {post.content}
        </div>
      </article>
    </main>
  );
}
