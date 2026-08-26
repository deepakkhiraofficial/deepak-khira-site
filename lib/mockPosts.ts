export interface Post {
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
  }
  
  // Mock posts
  export const MOCK_POSTS: Post[] = Array.from({ length: 8 }).map((_, i) => ({
    id: `post-${i + 1}`,
    slug: `sample-blog-post-${i + 1}`,
    title: `Sample Blog Post #${i + 1}`,
    excerpt:
      "This is a short excerpt for the blog post. It shows what the article is about and entices the reader to click through.",
    content:
      "Full content of the post goes here. In a real app you would fetch this from your CMS or API.",
    image: `/images/blog-${(i % 5) + 1}.jpg`,
    category: ["Tech", "Business", "Trading", "Marketing"][i % 4],
    tags: ["tips", "howto", i % 2 ? "deep" : "quick"],
    author: i % 3 === 0 ? "Deepak Kushwah" : "Team",
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    views: Math.floor(Math.random() * 2000),
  }));
  