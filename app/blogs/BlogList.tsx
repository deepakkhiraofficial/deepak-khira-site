"use client";

import { useState, useEffect, useRef } from "react";
import PostCard from "@/components/blog/PostCard";
import Link from "next/link";
import { motion } from "framer-motion";

interface Author {
  name: string;
  avatar: string;
}

interface Post {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  author: Author | string;
  date?: string;
  createdAt?: string;
  views?: number;
}

interface BlogResponse {
  posts: Post[];
  total: number;
}

const POSTS_PER_PAGE = 6;

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [trending, setTrending] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async (pageNumber: number, trendingPosts = false) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/posts?page=${pageNumber}&limit=${POSTS_PER_PAGE}${
          trendingPosts ? "&trending=true" : ""
        }`
      );
      if (!res.ok) {
        console.error(await res.text());
        return;
      }
      const data: BlogResponse = await res.json();
      setPosts((prev) =>
        pageNumber === 1 ? data.posts || [] : [...prev, ...(data.posts || [])]
      );
      setTotalPosts(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    setPage(1);
    fetchPosts(1, trending);
  }, [trending]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          posts.length < totalPosts
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [loading, posts, totalPosts]);

  // Fetch next page
  useEffect(() => {
    if (page > 1) fetchPosts(page, trending);
  }, [page]);

  return (
    <div>
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded ${
            !trending
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          } transition`}
          onClick={() => setTrending(false)}
        >
          Latest
        </button>
        <button
          className={`px-4 py-2 rounded ${
            trending
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          } transition`}
          onClick={() => setTrending(true)}
        >
          Trending
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((post) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link href={`/blogs/${post.slug}`}>
              <PostCard
                post={{
                  id: post.id || post._id,
                  title: post.title,
                  slug: post.slug,
                  excerpt: post.excerpt,
                  image: post.image,
                  author: post.author,
                  date: post.date,
                  createdAt: post.createdAt,
                }}
              />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Loader */}
      <div ref={containerRef} className="mt-8 flex justify-center">
        {loading && (
          <p className="text-gray-500 dark:text-gray-400">
            Loading more posts...
          </p>
        )}
      </div>
    </div>
  );
}
