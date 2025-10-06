import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, Move } from "lucide-react";
import * as Icons from "lucide-react";

interface Skill {
  id: string;
  category: string;
  name: string;
  icon?: string;
}

interface SkillCategory {
  id: string;
  name: string;
  icon?: string;
  display_order: number;
}

const AdminSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [skillFormData, setSkillFormData] = useState({
    category: "",
    name: "",
    icon: ""
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    icon: "",
    display_order: 0
  });
  const { toast } = useToast();

  // Common icons for selection
  const commonIcons = [
    "Code", "Database", "Globe", "Smartphone", "Laptop", "Server", "Cloud",
    "Cpu", "HardDrive", "Wifi", "Shield", "Lock", "Key", "Zap", "Layers",
    "Box", "Package", "Tool", "Wrench", "Hammer", "Screwdriver", "Settings",
    "Cog", "Gear", "Brain", "Lightbulb", "Target", "Rocket", "Star", "Heart",
    "Palette", "Brush", "Image", "Camera", "Video", "Music", "Headphones",
    "Monitor", "Tablet", "Phone", "Watch", "GameController2", "Joystick"
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchSkills(), fetchCategories()]);
    setIsLoading(false);
  };

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.error('Skills fetch error:', error);
        toast({
          title: "Error",
          description: `Failed to fetch skills: ${error.message}`,
          variant: "destructive"
        });
      } else {
        setSkills(data || []);
      }
    } catch (err) {
      console.error('Skills fetch exception:', err);
      toast({
        title: "Error",
        description: "Unexpected error while fetching skills",
        variant: "destructive"
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('skill_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Categories fetch error:', error);
        toast({
          title: "Error",
          description: `Failed to fetch categories: ${error.message}`,
          variant: "destructive"
        });
      } else {
        setCategories(data || []);
      }
    } catch (err) {
      console.error('Categories fetch exception:', err);
      toast({
        title: "Error",
        description: "Unexpected error while fetching categories",
        variant: "destructive"
      });
    }
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert "none" back to empty string for database
      const submitData = {
        ...skillFormData,
        icon: skillFormData.icon === "none" ? "" : skillFormData.icon
      };

      if (editingSkill) {
        const { error } = await supabase
          .from('skills')
          .update(submitData)
          .eq('id', editingSkill.id);

        if (error) {
          console.error('Skill update error:', error);
          toast({
            title: "Error",
            description: `Failed to update skill: ${error.message}`,
            variant: "destructive"
          });
        } else {
          toast({ title: "Success", description: "Skill updated successfully" });
          setEditingSkill(null);
          fetchSkills();
          resetSkillForm();
        }
      } else {
        const { error } = await supabase
          .from('skills')
          .insert([submitData]);

        if (error) {
          console.error('Skill create error:', error);
          toast({
            title: "Error",
            description: `Failed to create skill: ${error.message}`,
            variant: "destructive"
          });
        } else {
          toast({ title: "Success", description: "Skill created successfully" });
          fetchSkills();
          resetSkillForm();
        }
      }
    } catch (err) {
      console.error('Skill submit exception:', err);
      toast({
        title: "Error",
        description: "Unexpected error while saving skill",
        variant: "destructive"
      });
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('skill_categories')
          .update(categoryFormData)
          .eq('id', editingCategory.id);

        if (error) {
          console.error('Category update error:', error);
          toast({
            title: "Error",
            description: `Failed to update category: ${error.message}`,
            variant: "destructive"
          });
        } else {
          toast({ title: "Success", description: "Category updated successfully" });
          setEditingCategory(null);
          fetchCategories();
          resetCategoryForm();
        }
      } else {
        // Set display order for new categories
        const maxOrder = Math.max(...categories.map(c => c.display_order), 0);
        const categoryData = { ...categoryFormData, display_order: maxOrder + 1 };
        
        const { error } = await supabase
          .from('skill_categories')
          .insert([categoryData]);

        if (error) {
          console.error('Category create error:', error);
          toast({
            title: "Error",
            description: `Failed to create category: ${error.message}`,
            variant: "destructive"
          });
        } else {
          toast({ title: "Success", description: "Category created successfully" });
          fetchCategories();
          resetCategoryForm();
        }
      }
    } catch (err) {
      console.error('Category submit exception:', err);
      toast({
        title: "Error",
        description: "Unexpected error while saving category",
        variant: "destructive"
      });
    }
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillFormData({
      category: skill.category,
      name: skill.name,
      icon: skill.icon || ""
    });
  };

  const handleEditCategory = (category: SkillCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      icon: category.icon || "",
      display_order: category.display_order
    });
  };

  const handleDeleteSkill = async (id: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        const { error } = await supabase
          .from('skills')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Skill delete error:', error);
          toast({
            title: "Error",
            description: `Failed to delete skill: ${error.message}`,
            variant: "destructive"
          });
        } else {
          toast({ title: "Success", description: "Skill deleted successfully" });
          fetchSkills();
        }
      } catch (err) {
        console.error('Skill delete exception:', err);
        toast({
          title: "Error",
          description: "Unexpected error while deleting skill",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? All skills in this category will also need to be updated.')) {
      try {
        const { error } = await supabase
          .from('skill_categories')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Category delete error:', error);
          toast({
            title: "Error",
            description: `Failed to delete category: ${error.message}`,
            variant: "destructive"
          });
        } else {
          toast({ title: "Success", description: "Category deleted successfully" });
          fetchCategories();
        }
      } catch (err) {
        console.error('Category delete exception:', err);
        toast({
          title: "Error",
          description: "Unexpected error while deleting category",
          variant: "destructive"
        });
      }
    }
  };

  const resetSkillForm = () => {
    setSkillFormData({
      category: "",
      name: "",
      icon: ""
    });
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      icon: "",
      display_order: 0
    });
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="skills">Manage Skills</TabsTrigger>
          <TabsTrigger value="categories">Manage Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <Card className="glass-panel border-white/10 hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg md:text-xl">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSkillSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                    <Select
                      value={skillFormData.category}
                      onValueChange={(value) => setSkillFormData({...skillFormData, category: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            <div className="flex items-center gap-2">
                              {renderIcon(category.icon)}
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">Skill Name</Label>
                    <Input
                      id="name"
                      value={skillFormData.name}
                      onChange={(e) => setSkillFormData({...skillFormData, name: e.target.value})}
                      required
                      placeholder="e.g., React, Python, Photoshop"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="skill-icon" className="text-sm font-medium">Icon (Optional)</Label>
                    <Select
                      value={skillFormData.icon}
                      onValueChange={(value) => setSkillFormData({...skillFormData, icon: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="none">No Icon</SelectItem>
                        {commonIcons.map((iconName) => (
                          <SelectItem key={iconName} value={iconName}>
                            <div className="flex items-center gap-2">
                              {renderIcon(iconName)}
                              {iconName}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button type="submit" className="flex-1 sm:flex-none">
                    {editingSkill ? 'Update Skill' : 'Add Skill'}
                  </Button>
                  {editingSkill && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setEditingSkill(null);
                        resetSkillForm();
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

          <div className="space-y-4">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => {
              const categoryData = categories.find(c => c.name === category);
              return (
                <Card key={category} className="glass-panel border-white/10 hover:border-primary/30 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base md:text-lg flex items-center gap-2">
                      {renderIcon(categoryData?.icon)}
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {categorySkills.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border border-white/5 hover:bg-muted/70 transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {renderIcon(skill.icon)}
                            <span className="text-sm font-medium truncate">{skill.name}</span>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditSkill(skill)}
                              className="h-7 w-7 p-0 hover:bg-primary/10"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="h-7 w-7 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <Card className="glass-panel border-white/10 hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg md:text-xl">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category-name" className="text-sm font-medium">Category Name</Label>
                    <Input
                      id="category-name"
                      value={categoryFormData.name}
                      onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                      required
                      placeholder="e.g., Programming, Design Tools"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-icon" className="text-sm font-medium">Category Icon</Label>
                    <Select
                      value={categoryFormData.icon}
                      onValueChange={(value) => setCategoryFormData({...categoryFormData, icon: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {commonIcons.map((iconName) => (
                          <SelectItem key={iconName} value={iconName}>
                            <div className="flex items-center gap-2">
                              {renderIcon(iconName)}
                              {iconName}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button type="submit" className="flex-1 sm:flex-none">
                    {editingCategory ? 'Update Category' : 'Add Category'}
                  </Button>
                  {editingCategory && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setEditingCategory(null);
                        resetCategoryForm();
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
            {categories.map((category) => (
              <Card key={category.id} className="glass-panel border-white/10 hover:border-primary/30 hover:glow-effect transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {renderIcon(category.icon)}
                      <span className="text-base font-semibold truncate">{category.name}</span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCategory(category)}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Display Order: {category.display_order}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Skills: {skills.filter(s => s.category === category.name).length}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSkills;