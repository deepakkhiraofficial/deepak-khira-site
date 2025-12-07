import { writeFileSync } from "fs";
const baseUrl = "https://yourdomain.com";

const pages = ["", "about", "services", "contact", "blogs", "products"];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `
  <url>
    <loc>${baseUrl}/${page}</loc>
  </url>
`
  )
  .join("")}
</urlset>
`;

writeFileSync("public/sitemap.xml", sitemap);
console.log("Sitemap generated!");
