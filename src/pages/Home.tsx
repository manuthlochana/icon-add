import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
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
          {/* Left Side - Text Content */}
          <div className="space-y-6 animate-slideInLeft order-2 md:order-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight break-words">
              Hi, I'm{" "}
              <span className="text-primary bg-clip-text whitespace-normal">Manuth Lochana</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground">
              Developer • Software Innovator • Tech Visionary
            </p>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
              Crafting elegant solutions to complex problems. Passionate about
              building scalable applications and exploring the frontiers of
              technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
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

            {/* Scroll Indicator */}
            <div className="hidden md:flex flex-col items-center gap-2 pt-8 animate-bounce">
              <span className="text-sm text-muted-foreground">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
                <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Right Side - Profile Image */}
          <div className="flex justify-center animate-slideInRight order-1 md:order-2">
            <div className="relative group w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-2xl group-hover:blur-3xl smooth-transition opacity-60"></div>
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 opacity-40 blur-lg animate-pulse"></div>
                <img
                  src={profileImage || "/src/assets/profile-photo.jpg"}
                  alt="Manuth Lochana - Profile Photo"
                  className="rounded-full w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover relative z-10 border-2 border-primary/30 shadow-2xl group-hover:scale-105 smooth-transition animate-scaleIn mx-auto"
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;