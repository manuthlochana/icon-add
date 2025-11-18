import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Manuth Lochana - Developer & Tech Innovator";
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
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

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-10">
      {/* Floating Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Profile Image - Shows First on Mobile */}
          <div className="flex justify-center animate-slideInRight order-1 md:order-2 mb-8 md:mb-0">
            <div className="relative group w-full max-w-md">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/15 to-primary/20 blur-3xl opacity-50 group-hover:opacity-70 smooth-transition" 
                   style={{ 
                     borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                     transform: 'scale(1.1)'
                   }}>
              </div>
              
              {/* Main blob container with depth */}
              <div className="relative">
                <img
                  src={profileImage || "/src/assets/profile-photo.jpg"}
                  alt="Manuth Lochana - Profile Photo"
                  className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover relative z-10 group-hover:scale-105 smooth-transition animate-scaleIn mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
                  style={{ 
                    borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                    boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.1), 0 10px 40px rgba(0,0,0,0.15)'
                  }}
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* Text Content - Shows Second on Mobile */}
          <div className="space-y-6 animate-slideInLeft order-2 md:order-1 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight break-words">
              Hi, I'm{" "}
              <span className="text-primary bg-clip-text whitespace-normal">Manuth Lochana</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground">
              Developer • Software Innovator • Tech Visionary
            </p>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
              I'm a software developer from Sri Lanka and the founder of Thunder Storm Studio. I build innovative web solutions that combine technical excellence with creative design.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <Button
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-primary via-primary to-blue-600 hover:from-primary/90 hover:via-primary/90 hover:to-blue-700 smooth-transition shadow-xl text-lg px-8 py-6 w-full sm:w-auto"
                asChild
              >
                <Link to="/projects">Explore My Work</Link>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary hover:bg-primary hover:text-primary-foreground smooth-transition text-lg px-8 py-6 w-full sm:w-auto"
                asChild
              >
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>

            {/* Scroll Indicator - Desktop Only */}
            <div className="hidden md:flex flex-col items-center gap-2 pt-8 animate-bounce md:items-start">
              <span className="text-sm text-muted-foreground">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
                <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
