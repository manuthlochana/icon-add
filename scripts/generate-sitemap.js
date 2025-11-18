import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = "https://rqkpyxxzildluqxgbdva.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxa3B5eHh6aWxkbHVxeGdiZHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0ODY5MzgsImV4cCI6MjA3MzA2MjkzOH0.sJBqv_p1JY8N9mrLnaQTFfWqmAr7mVyk9y415Q_ShC0";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generateSitemap() {
  const baseUrl = "https://www.manuthlochana.site";
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: "", priority: "1.0", changefreq: "daily" },
    { url: "/about", priority: "0.8", changefreq: "weekly" },
    { url: "/skills", priority: "0.8", changefreq: "weekly" },
    { url: "/education", priority: "0.8", changefreq: "weekly" },
    { url: "/contact", priority: "0.8", changefreq: "monthly" },
    { url: "/projects", priority: "0.9", changefreq: "weekly" },
    { url: "/docs", priority: "0.9", changefreq: "daily" },
  ];

  // Fetch articles
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, updated_at, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

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

  // Write to public folder
  const publicPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(publicPath, xml, 'utf-8');
  
  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
  console.log(`📄 Total URLs: ${staticPages.length + (articles?.length || 0)}`);
}

generateSitemap().catch(console.error);
