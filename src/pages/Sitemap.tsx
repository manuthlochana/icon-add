import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Sitemap = () => {
  const [sitemap, setSitemap] = useState<string>("");

  useEffect(() => {
    const generateSitemap = async () => {
      const baseUrl = "https://manuthlochana.site";
      const currentDate = new Date().toISOString();

      // Static pages
      const staticPages = [
        { url: "", priority: "1.0", changefreq: "daily" },
        { url: "/about", priority: "0.8", changefreq: "weekly" },
        { url: "/skills", priority: "0.8", changefreq: "weekly" },
        { url: "/education", priority: "0.8", changefreq: "weekly" },
        { url: "/contact", priority: "0.8", changefreq: "monthly" },
        { url: "/portfolio", priority: "0.9", changefreq: "weekly" },
        { url: "/projects", priority: "0.9", changefreq: "weekly" },
        { url: "/docs", priority: "0.9", changefreq: "daily" },
      ];

      // Fetch articles
      const { data: articles } = await supabase
        .from("articles")
        .select("slug, updated_at, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      // Fetch projects
      const { data: projects } = await supabase
        .from("projects")
        .select("id, created_at")
        .order("created_at", { ascending: false });

      // Generate XML
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      // Add static pages
      staticPages.forEach((page) => {
        xml += "  <url>\n";
        xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
        xml += `    <lastmod>${currentDate}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += "  </url>\n";
      });

      // Add articles
      articles?.forEach((article) => {
        xml += "  <url>\n";
        xml += `    <loc>${baseUrl}/docs/${article.slug}</loc>\n`;
        xml += `    <lastmod>${article.updated_at || article.published_at}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += "  </url>\n";
      });

      xml += "</urlset>";

      setSitemap(xml);
    };

    generateSitemap();
  }, []);

  useEffect(() => {
    if (sitemap) {
      // Set content type to XML
      const htmlElement = document.querySelector("html");
      if (htmlElement) {
        htmlElement.innerHTML = `<pre style="word-wrap: break-word; white-space: pre-wrap;">${sitemap.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`;
      }
    }
  }, [sitemap]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Sitemap.xml</h1>
        <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
          {sitemap}
        </pre>
      </div>
    </div>
  );
};

export default Sitemap;
