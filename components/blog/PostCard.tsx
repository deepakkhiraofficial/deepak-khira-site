"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: { name: string; avatar: string };
  date: string;
  slug: string;
};

interface PostCardProps {
  post: Post;
}

// Hydration-safe date formatter
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <motion.article
      layout
      whileHover={{ scale: 1.03 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      {/* Post Image */}
      <div className="relative w-full h-48 md:h-56 lg:h-64 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          priority
        />
      </div>

      {/* Post Content */}
      <div className="p-4 md:p-6 space-y-3">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base line-clamp-3">
          {post.excerpt}
        </p>

        {/* Author & Date */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {post.author.name}
            </span>
          </div>
          <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
        </div>
      </div>
    </motion.article>
  );
}
