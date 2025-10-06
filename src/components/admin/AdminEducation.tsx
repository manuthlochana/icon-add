import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit } from "lucide-react";

interface Education {
  id: string;
  course: string;
  status: string;
  institution: string;
  description: string;
}

const statusOptions = [
  "Completed",
  "In Progress",
  "Planned",
  "Certified"
];

const AdminEducation = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [formData, setFormData] = useState({
    course: "",
    status: "",
    institution: "",
    description: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch education data",
        variant: "destructive"
      });
    } else {
      setEducation(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEducation) {
      const { error } = await supabase
        .from('education')
        .update(formData)
        .eq('id', editingEducation.id);

      if (!error) {
        toast({ title: "Success", description: "Education entry updated successfully" });
        setEditingEducation(null);
        fetchEducation();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('education')
        .insert([formData]);

      if (!error) {
        toast({ title: "Success", description: "Education entry created successfully" });
        fetchEducation();
        resetForm();
      }
    }
  };

  const handleEdit = (educationItem: Education) => {
    setEditingEducation(educationItem);
    setFormData({
      course: educationItem.course,
      status: educationItem.status,
      institution: educationItem.institution,
      description: educationItem.description
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this education entry?')) {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);

      if (!error) {
        toast({ title: "Success", description: "Education entry deleted successfully" });
        fetchEducation();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      course: "",
      status: "",
      institution: "",
      description: ""
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-white/10 hover:border-primary/30 transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl">
            {editingEducation ? 'Edit Education Entry' : 'Add New Education Entry'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="course" className="text-sm font-medium">Course/Program</Label>
                <Input
                  id="course"
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                  required
                  placeholder="e.g., Bachelor of Computer Science"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="institution" className="text-sm font-medium">Institution</Label>
                <Input
                  id="institution"
                  value={formData.institution}
                  onChange={(e) => setFormData({...formData, institution: e.target.value})}
                  required
                  placeholder="e.g., University of Technology"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the program or achievements"
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button type="submit" className="flex-1 sm:flex-none">
                {editingEducation ? 'Update Entry' : 'Add Entry'}
              </Button>
              {editingEducation && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setEditingEducation(null);
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {education.map((educationItem) => (
          <Card key={educationItem.id} className="glass-panel border-white/10 hover:border-primary/30 hover:glow-effect transition-all duration-300 group">
            <CardHeader className="pb-3">
              <CardTitle className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <span className="text-base font-semibold">{educationItem.course}</span>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(educationItem)}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(educationItem.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-medium text-muted-foreground">
                {educationItem.institution}
              </p>
              <div>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  educationItem.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                  educationItem.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                  educationItem.status === 'Certified' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {educationItem.status}
                </span>
              </div>
              {educationItem.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {educationItem.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminEducation;