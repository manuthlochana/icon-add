import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      // Try to load from Supabase Storage first
      const { data: files, error } = await supabase.storage
        .from('profile-pictures')
        .list('', { limit: 1 });

      if (!error && files && files.length > 0) {
        const { data } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(files[0].name);
        
        setProfileImage(data.publicUrl);
      }
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  };
  const scrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Floating Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="animate-fadeInUp">
          <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-6 leading-tight">
            Manuth<br />
            <span className="text-primary">Lochana</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Developer • Software Innovator • Tech Visionary
          </p>

          {/* Profile Photo */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <img
                src={profileImage || "/src/assets/profile-photo.jpg"}
                alt="Manuth Lochana - Profile Photo"
                className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover profile-glow animate-glow border-4 border-white/20"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-accent/20 pointer-events-none"></div>
            </div>
          </div>

          <Button
            onClick={scrollToProjects}  
            variant="hero"
            size="xl"
            className="animate-slideInUp text-lg font-semibold"
          >
            Explore My Work
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;