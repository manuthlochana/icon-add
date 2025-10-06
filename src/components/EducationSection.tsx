import { useState, useEffect } from "react";
import { GraduationCap, BookOpen, Target, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const EducationSection = () => {
  const [educationItems, setEducationItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const iconMap: Record<string, any> = {
    "Completed": <GraduationCap className="w-6 h-6" />,
    "In Progress": <BookOpen className="w-6 h-6" />,
    "Ongoing": <Target className="w-6 h-6" />,
    "Planned": <Zap className="w-6 h-6" />
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEducationItems(data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <section id="education" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center">Loading education...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-20 relative">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-16 animate-fadeInUp">
          Education & <span className="text-primary">Learning</span>
        </h2>

        <div className="max-w-4xl mx-auto">
          {/* Education Timeline */}
          <div className="space-y-8 mb-12">
            {educationItems.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row glass-panel p-6 rounded-xl hover:glow-effect smooth-transition animate-slideInLeft"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                      {iconMap[item.status] || <GraduationCap className="w-6 h-6" />}
                    </div>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="text-xl font-bold text-foreground">{item.course}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'Completed' 
                        ? 'bg-accent/20 text-accent border border-accent/30' 
                        : 'bg-primary/20 text-primary border border-primary/30'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-primary font-medium mb-2">{item.institution}</p>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Current Training */}
          <div className="glass-panel p-8 rounded-2xl animate-slideInRight">
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-primary" />
              Career Focus
            </h3>
            
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-lg font-semibold text-primary mb-3">Career Aspiration</h4>
              <p className="text-muted-foreground leading-relaxed">
                Aspiring software engineer combining technical expertise with creative vision. 
                My goal is to bridge the gap between cutting-edge technology and innovative design, 
                creating solutions that are both functionally robust and visually compelling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;