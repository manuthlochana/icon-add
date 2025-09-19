const AboutSection = () => {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-16 animate-fadeInUp">
            About <span className="text-primary">Me</span>
          </h2>
          
          <div className="glass-panel p-8 md:p-12 rounded-2xl animate-slideInLeft">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              I'm <span className="text-primary font-semibold">Manuth Lochana</span>, passionate about technology, coding, and creative innovation. I work on projects that combine software development, AI, and design. I also founded <span className="text-accent font-semibold">Thunder Storm Studio</span>, where I focus on video editing, motion graphics, and coding-driven projects.
            </p>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-6">
              Additionally, I explore advanced technologies including AI fine-tuning, system optimization, and creative problem-solving. My journey combines technical expertise with creative vision, allowing me to build innovative solutions that bridge the gap between functionality and aesthetics.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <div className="glass-panel px-4 py-2 rounded-full">
                <span className="text-primary font-medium">AI Enthusiast</span>
              </div>
              <div className="glass-panel px-4 py-2 rounded-full">
                <span className="text-primary font-medium">Creative Developer</span>
              </div>
              <div className="glass-panel px-4 py-2 rounded-full">
                <span className="text-primary font-medium">Tech Innovator</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;