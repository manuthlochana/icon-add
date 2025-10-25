import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Eye, ArrowLeft, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const DocArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<any>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    setIsLoading(true);

    // Fetch article with category
    const { data: articleData, error } = await supabase
      .from('articles')
      .select('*, article_categories(name, slug)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (!error && articleData) {
      setArticle(articleData);
      
      // Increment view count
      await supabase
        .from('articles')
        .update({ view_count: articleData.view_count + 1 })
        .eq('id', articleData.id);

      // Fetch tags
      const { data: tagsData } = await supabase
        .from('article_tag_relations')
        .select('article_tags(name, slug)')
        .eq('article_id', articleData.id);

      if (tagsData) {
        setTags(tagsData.map((t: any) => t.article_tags));
      }
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
          <div className="text-center">Loading article...</div>
        </div>
      </section>
    );
  }

  if (!article) {
    return (
      <section className="min-h-screen py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Article not found</h1>
            <Button asChild variant="hero">
              <Link to="/docs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Docs
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-8">
            <Link to="/docs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Docs
            </Link>
          </Button>

          {/* Article Header */}
          <article className="animate-fadeInUp">
            {article.article_categories && (
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                {article.article_categories.name}
              </Badge>
            )}

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(article.published_at)}
              </span>
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {article.view_count} views
              </span>
            </div>

            {/* Featured Image */}
            {article.featured_image_url && (
              <div className="mb-12 rounded-xl overflow-hidden">
                <img
                  src={article.featured_image_url}
                  alt={article.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg prose-invert max-w-none glass-panel p-8 md:p-12 rounded-2xl mb-8">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center mb-8">
                <Tag className="w-4 h-4 text-muted-foreground" />
                {tags.map((tag) => (
                  <Badge
                    key={tag.slug}
                    variant="outline"
                    className="bg-accent/10 text-accent border-accent/30"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
};

export default DocArticle;