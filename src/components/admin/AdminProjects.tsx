import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  link: string;
  image_url?: string;
}

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    link: "",
    image_url: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive"
      });
    } else {
      setProjects(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      title: formData.title,
      description: formData.description,
      technologies: formData.technologies.split(',').map(t => t.trim()),
      link: formData.link,
      image_url: formData.image_url || null
    };

    if (editingProject) {
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', editingProject.id);

      if (!error) {
        toast({ title: "Success", description: "Project updated successfully" });
        setEditingProject(null);
        fetchProjects();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('projects')
        .insert([projectData]);

      if (!error) {
        toast({ title: "Success", description: "Project created successfully" });
        fetchProjects();
        resetForm();
      }
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies?.join(', ') || '',
      link: project.link,
      image_url: project.image_url || ''
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (!error) {
        toast({ title: "Success", description: "Project deleted successfully" });
        fetchProjects();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      technologies: "",
      link: "",
      image_url: ""
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-white/10 hover:border-primary/30 transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="link" className="text-sm font-medium">Link</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="technologies" className="text-sm font-medium">Technologies (comma separated)</Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                  placeholder="React, TypeScript, Supabase"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="image_url" className="text-sm font-medium">Image URL (optional)</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button type="submit" className="flex-1 sm:flex-none">
                {editingProject ? 'Update Project' : 'Add Project'}
              </Button>
              {editingProject && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setEditingProject(null);
                    resetForm();
                  }}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="glass-panel border-white/10 hover:border-primary/30 hover:glow-effect transition-all duration-300 group">
            <CardHeader className="pb-3">
              <CardTitle className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <span className="text-base font-semibold truncate">{project.title}</span>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(project)}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(project.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {project.description}
              </p>
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium hover:underline transition-colors"
                >
                  View Project →
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;