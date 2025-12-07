export default function sitemap() {
    const baseUrl = "https://your-domain.com";
  
    return [
      {
        url: `${baseUrl}/`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 1.0
      },
      {
        url: `${baseUrl}/services`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.9
      },
      {
        url: `${baseUrl}/blogs`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.9
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date().toISOString(),
        changeFrequency: "monthly",
        priority: 0.8
      }
    ];
  }
  