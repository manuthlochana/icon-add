import { useState, useEffect } from "react";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const ProjectsSection = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <section id="projects" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-16 animate-fadeInUp">
          Featured <span className="text-primary">Projects</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="glass-panel p-6 rounded-xl hover:glow-effect hover:-translate-y-2 smooth-transition animate-slideInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-3">{project.title}</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies?.map((tech: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {project.link && (
                <Button
                  asChild
                  variant="floating"
                  size="sm"
                >
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Project
                  </a>
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* GitHub CTA */}
        <div className="text-center animate-slideInUp">
          <div className="glass-panel p-8 rounded-2xl inline-block">
            <h3 className="text-2xl font-bold text-foreground mb-4">Explore More Projects</h3>
            <p className="text-muted-foreground mb-6">
              Check out my GitHub for more projects and open-source contributions
            </p>
            <Button
              asChild
              variant="hero"
              size="lg"
            >
              <a 
                href="https://github.com/manuthlochana" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <Github className="w-5 h-5 mr-3" />
                View GitHub Profile
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;