import { useState, useEffect } from "react";
import { Code, Database, Brain, Shield, Palette, Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SkillsSection = () => {
  const [skillCategories, setSkillCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const iconMap: Record<string, any> = {
    "Programming": <Code className="w-8 h-8" />,
    "Frameworks": <Wrench className="w-8 h-8" />,
    "Databases": <Database className="w-8 h-8" />,
    "AI & ML": <Brain className="w-8 h-8" />,
    "Cybersecurity": <Shield className="w-8 h-8" />,
    "Creative Tools": <Palette className="w-8 h-8" />
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data: skills, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true });

    if (!error && skills) {
      // Group skills by category
      const groupedSkills = skills.reduce((acc: any, skill: any) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill.name);
        return acc;
      }, {});

      // Convert to the format expected by the component
      const categories = Object.entries(groupedSkills).map(([category, skillsList], index) => ({
        title: category,
        icon: iconMap[category] || <Code className="w-8 h-8" />,
        skills: skillsList as string[],
        color: index % 2 === 0 ? "text-primary" : "text-accent"
      }));

      setSkillCategories(categories);
    }
    setIsLoading(false);
  };

  const otherTools = [
    "Git", "GitHub", "Arduino", "IoT", "Docker", "Linux", "Postman"
  ];

  if (isLoading) {
    return (
      <section id="skills" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center">Loading skills...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-16 animate-fadeInUp">
          Skills & <span className="text-primary">Technologies</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {skillCategories.map((category, index) => (
            <div
              key={category.title}
              className="glass-panel p-6 rounded-xl hover:glow-effect smooth-transition animate-slideInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-4">
                <div className={`${category.color} mr-3`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-white/10 text-sm text-muted-foreground rounded-full border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:bg-white/5 dark:border-white/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Work in AI Highlight */}
        <div className="glass-panel p-8 rounded-2xl mb-8 animate-slideInLeft">
          <h3 className="text-2xl font-bold text-primary mb-4 flex items-center">
            <Brain className="w-6 h-6 mr-3" />
            Recent Work in AI
          </h3>
          <p className="text-lg text-muted-foreground mb-4">
            Currently working on advanced AI projects using Hugging Face's LLaMA 4 fine-tuning techniques, 
            focusing on PEFT (Parameter-Efficient Fine-Tuning) methods for creating specialized AI models.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Hugging Face", "LLaMA 4", "PEFT", "Model Training", "AI Systems"].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full border border-accent/30"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Other Tools */}
        <div className="glass-panel p-6 rounded-xl animate-slideInRight">
          <h3 className="text-xl font-semibold text-foreground mb-4">Other Tools & Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {otherTools.map((tool) => (
              <span
                key={tool}
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
