import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus } from "lucide-react";

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('article_categories')
      .select('*')
      .order('name');

    if (!error && data) {
      setCategories(data);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : generateSlug(name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from('article_categories')
        .update(formData)
        .eq('id', editingId);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Category updated successfully!" });
      }
    } else {
      const { error } = await supabase
        .from('article_categories')
        .insert([formData]);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Category created successfully!" });
      }
    }

    resetForm();
    fetchCategories();
  };

  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setEditingId(category.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will unlink all articles from this category.')) return;

    const { error } = await supabase
      .from('article_categories')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Category deleted successfully!" });
      fetchCategories();
    }
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "" });
    setIsEditing(false);
    setEditingId(null);
  };

  if (isEditing) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{editingId ? 'Edit Category' : 'New Category'}</h3>
          <Button onClick={resetForm} variant="outline">Cancel</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
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

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" variant="hero">
            {editingId ? 'Update Category' : 'Create Category'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Manage Categories</h3>
        <Button onClick={() => setIsEditing(true)} variant="hero">
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="glass-panel p-6 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-xl font-semibold">{category.name}</h4>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(category)} size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button onClick={() => handleDelete(category.id)} size="sm" variant="destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Slug: {category.slug}</p>
            {category.description && (
              <p className="text-muted-foreground">{category.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;