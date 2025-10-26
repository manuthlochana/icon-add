import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Tag, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  featured_image_url: string;
  published_at: string;
  view_count: number;
  category_id: string;
  article_categories: { name: string; slug: string } | null;
}

const Docs = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Documentation - Manuth Lochana";
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('article_categories')
      .select('*')
      .order('name');

    if (categoriesData) {
      setCategories(categoriesData);
    }

    // Fetch articles
    let query = supabase
      .from('articles')
      .select('*, article_categories(name, slug)')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    const { data: articlesData, error } = await query;

    if (!error && articlesData) {
      setArticles(articlesData as Article[]);
    }
    
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <section className="min-h-screen py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center">Loading articles...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-20 relative">
      {/* Animated background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 animate-fadeInUp">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Knowledge <span className="text-primary">Base</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Articles, tutorials, and insights about technology, development, and innovation.
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-12 animate-slideInLeft">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedCategory === null
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-panel hover:bg-white/10'
              }`}
            >
              All Articles
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'glass-panel hover:bg-white/10'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <Link
                key={article.id}
                to={`/docs/${article.slug}`}
                className="group glass-panel rounded-xl overflow-hidden hover:glow-effect smooth-transition animate-slideInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {article.featured_image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.featured_image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  {article.article_categories && (
                    <Badge className="mb-3 bg-primary/20 text-primary border-primary/30">
                      {article.article_categories.name}
                    </Badge>
                  )}
                  
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {article.summary}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(article.published_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {article.view_count}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Docs;