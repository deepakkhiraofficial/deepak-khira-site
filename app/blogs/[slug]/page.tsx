export async function generateMetadata({ params }) {
  const blog = await getBlog(params.slug); // your blog fetch function

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: `https://deepakkhiraenterprises.netlify.app/blogs/${params.slug}`,
      images: [
        {
          url: blog.image || "/og-image.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
