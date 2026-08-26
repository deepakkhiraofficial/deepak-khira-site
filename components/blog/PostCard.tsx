"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export interface PostCardPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  author:
    | string
    | {
        name: string;
        avatar: string;
      };
  date?: string;
  createdAt?: string;
}

interface PostCardProps {
  post: PostCardPost;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function getAuthorName(author: string | { name: string; avatar: string }) {
  return typeof author === "string" ? author : author.name;
}

function getAuthorAvatar(author: string | { name: string; avatar: string }) {
  if (typeof author === "object" && author.avatar) {
    return author.avatar;
  }

  return "/business_logo.png";
}

export default function PostCard({ post }: PostCardProps) {
  const image = post.image || "/business_logo.png";

  const authorName = getAuthorName(post.author);

  const authorAvatar = getAuthorAvatar(post.author);

  const postDate = post.date || post.createdAt;

  return (
    <motion.article
      layout
      whileHover={{ scale: 1.03 }}
      className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl dark:bg-slate-800"
    >
      {/* =====================================================
          POST IMAGE
      ====================================================== */}

      <div className="relative h-48 w-full overflow-hidden md:h-56 lg:h-64">
        <Image
          src={image}
          alt={post.title}
          fill
          sizes="(max-inline-size: 768px) 100vw, (max-inline-size: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* =====================================================
          POST CONTENT
      ====================================================== */}

      <div className="space-y-3 p-4 md:p-6">
        <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 dark:text-gray-100 md:text-xl">
          {post.title}
        </h3>

        <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300 md:text-base">
          {post.excerpt}
        </p>

        {/* ===================================================
            AUTHOR + DATE
        ==================================================== */}

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Image
              src={authorAvatar}
              alt={authorName}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />

            <span className="truncate text-sm text-gray-500 dark:text-gray-400">
              {authorName}
            </span>
          </div>

          {postDate && (
            <span className="shrink-0 text-xs text-gray-400">
              {formatDate(postDate)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
