interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  keywords?: string[];
  siteName?: string;
  author?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  schema?: any; // JSON-LD Structured Data
}

export default function SEO({
  title,
  description,
  url,
  image,
  keywords = [],
  siteName = "Deepak Khira Enterprises",
  author = "Deepak Kushwah",
  noIndex = false,
  noFollow = false,
  schema,
}: SEOProps) {
  const robots = `${noIndex ? "noindex" : "index"}, ${noFollow ? "nofollow" : "follow"}`;

  return (
    <>
      {/* Main Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      <meta name="author" content={author} />

      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}

      {/* Robots */}
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />

      {/* OpenGraph (Facebook, LinkedIn, Instagram) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {siteName && <meta property="og:site_name" content={siteName} />}
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content="website" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Favicons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <meta name="theme-color" content="#ffffff" />

      {/* JSON-LD Structured Data (Boosts SEO) */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </>
  );
}
