// app/blogs/page.tsx
import Head from "next/head";
import BlogList from "./BlogList";

export default function BlogsPage() {
  return (
    <>
      <Head>
        <title>Blogs | Deepak Khira Enterprises</title>
        <meta
          name="description"
          content="Read the latest blogs about web development, products, and business solutions by Deepak Khira Enterprises."
        />
      </Head>

      <main className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
        <section className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Our Latest Blogs
          </h1>

          <BlogList />
        </section>
      </main>
    </>
  );
}
