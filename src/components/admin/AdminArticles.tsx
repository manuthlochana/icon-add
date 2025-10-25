import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, Eye } from "lucide-react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const AdminArticles = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    featured_image_url: "",
    category_id: "",
    status: "draft",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [articlesRes, categoriesRes, tagsRes] = await Promise.all([
      supabase.from('articles').select('*, article_categories(name)').order('created_at', { ascending: false }),
      supabase.from('article_categories').select('*'),
      supabase.from('article_tags').select('*')
    ]);

    if (articlesRes.data) setArticles(articlesRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (tagsRes.data) setTags(tagsRes.data);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingId ? prev.slug : generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const articleData = {
      ...formData,
      author_id: user.id,
      published_at: formData.status === 'published' ? new Date().toISOString() : null,
    };

    if (editingId) {
      const { error } = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', editingId);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }

      // Update tags
      await supabase.from('article_tag_relations').delete().eq('article_id', editingId);
    } else {
      const { data, error } = await supabase
        .from('articles')
        .insert([articleData])
        .select()
        .single();

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }

      // Insert tags for new article
      if (selectedTags.length > 0 && data?.id) {
        const tagRelations = selectedTags.map(tagId => ({
          article_id: data.id,
          tag_id: tagId
        }));
        await supabase.from('article_tag_relations').insert(tagRelations);
      }

      toast({ title: "Success", description: "Article saved successfully!" });
      resetForm();
      fetchData();
      return;
    }

    // Insert tags for updated article
    if (selectedTags.length > 0 && editingId) {
      const tagRelations = selectedTags.map(tagId => ({
        article_id: editingId,
        tag_id: tagId
      }));
      await supabase.from('article_tag_relations').insert(tagRelations);
    }

    toast({ title: "Success", description: "Article saved successfully!" });
    resetForm();
    fetchData();
  };

  const handleEdit = async (article: any) => {
    setFormData({
      title: article.title,
      slug: article.slug,
      summary: article.summary || "",
      content: article.content,
      featured_image_url: article.featured_image_url || "",
      category_id: article.category_id || "",
      status: article.status,
    });

    // Fetch tags for this article
    const { data: tagRelations } = await supabase
      .from('article_tag_relations')
      .select('tag_id')
      .eq('article_id', article.id);

    if (tagRelations) {
      setSelectedTags(tagRelations.map((tr: any) => tr.tag_id));
    }

    setEditingId(article.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    const { error } = await supabase.from('articles').delete().eq('id', id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Article deleted successfully!" });
      fetchData();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      summary: "",
      content: "",
      featured_image_url: "",
      category_id: "",
      status: "draft",
    });
    setSelectedTags([]);
    setIsEditing(false);
    setEditingId(null);
  };

  const editorOptions = useMemo(() => ({
    spellChecker: false,
    placeholder: "Write your article content in Markdown...",
    status: false,
    toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "|", "preview", "side-by-side", "fullscreen", "|", "guide"] as any,
  }), []);

  if (isEditing) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{editingId ? 'Edit Article' : 'New Article'}</h3>
          <Button onClick={resetForm} variant="outline">Cancel</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Summary</label>
            <Textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content (Markdown)</label>
            <SimpleMDE
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              options={editorOptions}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Featured Image URL</label>
              <Input
                value={formData.featured_image_url}
                onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag.id)
                          ? prev.filter(id => id !== tag.id)
                          : [...prev, tag.id]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-transparent border-border'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" variant="hero" size="lg">
            {editingId ? 'Update Article' : 'Create Article'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Manage Articles</h3>
        <Button onClick={() => setIsEditing(true)} variant="hero">
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="glass-panel p-6 rounded-xl flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-xl font-semibold">{article.title}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  article.status === 'published' ? 'bg-accent/20 text-accent' : 'bg-muted'
                }`}>
                  {article.status}
                </span>
              </div>
              <p className="text-muted-foreground mb-2">{article.summary}</p>
              <div className="text-sm text-muted-foreground">
                Category: {article.article_categories?.name || 'None'} • Views: {article.view_count}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleEdit(article)} size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
              <Button onClick={() => handleDelete(article.id)} size="sm" variant="destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminArticles;