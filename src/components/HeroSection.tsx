import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.jpg";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated background blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slideInLeft">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Hi, I'm{" "}
              <span className="text-primary bg-clip-text">Manuth Lochana</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Full Stack Developer | AI Enthusiast | Problem Solver
            </p>
            <p className="text-lg text-muted-foreground max-w-xl">
              Crafting elegant solutions to complex problems. Passionate about
              building scalable applications and exploring the frontiers of
              artificial intelligence.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button size="lg" variant="hero" className="group relative overflow-hidden" asChild>
                <Link to="/contact">
                  <span className="relative z-10">Get In Touch</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="hover:scale-105 smooth-transition" asChild>
                <Link to="/projects">View Work</Link>
              </Button>
            </div>
            <div className="flex gap-6 pt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary smooth-transition hover:scale-125 transform"
              >
                <Github size={28} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary smooth-transition hover:scale-125 transform"
              >
                <Linkedin size={28} />
              </a>
              <a
                href="mailto:contact@example.com"
                className="text-muted-foreground hover:text-primary smooth-transition hover:scale-125 transform"
              >
                <Mail size={28} />
              </a>
            </div>
          </div>
          <div className="flex justify-center animate-slideInRight">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-full blur-3xl group-hover:blur-[80px] smooth-transition opacity-75"></div>
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-primary opacity-50 animate-spin-slow blur-xl"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-accent via-primary to-accent opacity-50 animate-spin-slow blur-xl" style={{ animationDirection: 'reverse' }}></div>
                <img
                  src={profilePhoto}
                  alt="Manuth Lochana Profile"
                  className="rounded-full w-72 h-72 md:w-96 md:h-96 object-cover relative z-10 border-4 border-primary/40 shadow-2xl group-hover:scale-105 smooth-transition animate-scaleIn"
                  style={{ 
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;