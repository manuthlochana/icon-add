const About = () => {
  return (
    <section className="min-h-screen py-20 relative">
      {/* Animated background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-16 animate-fadeInUp">
            About <span className="text-primary">Me</span>
          </h1>
          
          <div className="glass-panel p-8 md:p-12 rounded-2xl animate-slideInLeft space-y-6">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              I'm <span className="text-primary font-semibold">Manuth Lochana</span>, passionate about technology, coding, and creative innovation. I work on projects that combine software development, AI, and design. I also founded <span className="text-accent font-semibold">Thunder Storm Studio</span>, where I focus on video editing, motion graphics, and coding-driven projects.
            </p>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
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

          <div className="mt-12 glass-panel p-8 rounded-2xl animate-slideInRight">
            <h2 className="text-2xl font-bold text-foreground mb-6">Thunder Storm Studio</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              As the founder of Thunder Storm Studio, I lead projects that blend creativity with technical excellence. 
              From video editing and motion graphics to full-stack development and AI integration, 
              we push the boundaries of what's possible at the intersection of art and technology.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;