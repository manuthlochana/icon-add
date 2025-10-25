-- Create categories table for organizing articles
CREATE TABLE public.article_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tags table for article tagging
CREATE TABLE public.article_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category_id UUID REFERENCES public.article_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  view_count INTEGER NOT NULL DEFAULT 0
);

-- Create junction table for article tags (many-to-many)
CREATE TABLE public.article_tag_relations (
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.article_tags(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (article_id, tag_id)
);

-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tag_relations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for article_categories
CREATE POLICY "Anyone can view categories"
  ON public.article_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.article_categories FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for article_tags
CREATE POLICY "Anyone can view tags"
  ON public.article_tags FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage tags"
  ON public.article_tags FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for articles
CREATE POLICY "Anyone can view published articles"
  ON public.articles FOR SELECT
  USING (status = 'published' OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create articles"
  ON public.articles FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update articles"
  ON public.articles FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete articles"
  ON public.articles FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for article_tag_relations
CREATE POLICY "Anyone can view article tag relations"
  ON public.article_tag_relations FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage article tag relations"
  ON public.article_tag_relations FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Storage policies for article images
CREATE POLICY "Anyone can view article images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'article-images');

CREATE POLICY "Admins can upload article images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'article-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update article images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'article-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete article images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'article-images' AND has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_article_categories_updated_at
  BEFORE UPDATE ON public.article_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_articles_status ON public.articles(status);
CREATE INDEX idx_articles_category ON public.articles(category_id);
CREATE INDEX idx_articles_author ON public.articles(author_id);
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX idx_article_tag_relations_article ON public.article_tag_relations(article_id);
CREATE INDEX idx_article_tag_relations_tag ON public.article_tag_relations(tag_id);