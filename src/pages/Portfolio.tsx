import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import EducationSection from "@/components/EducationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import { supabase } from "@/integrations/supabase/client";

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Fetch all data concurrently
        const [skills, projects, education, messages, contacts, profileImage] = await Promise.allSettled([
          supabase.from('skills').select('*').order('category', { ascending: true }),
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('education').select('*').order('created_at', { ascending: false }),
          supabase.from('messages').select('*').order('created_at', { ascending: false }),
          supabase.from('contacts').select('*'),
          supabase.storage.from('profile-pictures').list('', { limit: 1 })
        ]);

        // Add a minimum loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Start fade out transition
        setFadeOut(true);
        
        // Wait for fade out animation to complete, then hide loading
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('Error loading data:', error);
        // Even on error, hide loading after a delay
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => setIsLoading(false), 500);
        }, 2000);
      }
    };

    loadAllData();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`scroll-smooth animate-fade-in`}>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;