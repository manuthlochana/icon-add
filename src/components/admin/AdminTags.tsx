import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus } from "lucide-react";

const AdminTags = () => {
  const [tags, setTags] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from('article_tags')
      .select('*')
      .order('name');

    if (!error && data) {
      setTags(data);
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
        .from('article_tags')
        .update(formData)
        .eq('id', editingId);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Tag updated successfully!" });
      }
    } else {
      const { error } = await supabase
        .from('article_tags')
        .insert([formData]);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Tag created successfully!" });
      }
    }

    resetForm();
    fetchTags();
  };

  const handleEdit = (tag: any) => {
    setFormData({
      name: tag.name,
      slug: tag.slug,
    });
    setEditingId(tag.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will remove this tag from all articles.')) return;

    const { error } = await supabase
      .from('article_tags')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Tag deleted successfully!" });
      fetchTags();
    }
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "" });
    setIsEditing(false);
    setEditingId(null);
  };

  if (isEditing) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{editingId ? 'Edit Tag' : 'New Tag'}</h3>
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

          <Button type="submit" variant="hero">
            {editingId ? 'Update Tag' : 'Create Tag'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Manage Tags</h3>
        <Button onClick={() => setIsEditing(true)} variant="hero">
          <Plus className="w-4 h-4 mr-2" />
          New Tag
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="glass-panel px-4 py-3 rounded-lg flex items-center gap-3"
          >
            <span className="font-medium">{tag.name}</span>
            <div className="flex gap-1">
              <Button onClick={() => handleEdit(tag)} size="sm" variant="ghost">
                <Edit className="w-3 h-3" />
              </Button>
              <Button onClick={() => handleDelete(tag.id)} size="sm" variant="ghost">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTags;