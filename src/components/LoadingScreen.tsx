import { Spinner } from "@/components/ui/spinner";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center glass-panel animate-fade-in">
      {/* Floating Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fadeInUp" style={{ color: '#ffca57' }}>
            Manuth <span className="text-primary">Lochana</span>
          </h1>
          <p className="text-lg text-muted-foreground animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
            Loading portfolio...
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-6 animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
          <Spinner size="xl" variant="default" />
          <Spinner size="md" variant="dots" />
        </div>
        
        <div className="mt-8 glass-panel p-4 rounded-lg animate-fadeInUp" style={{ animationDelay: "0.6s" }}>
          <p className="text-sm text-muted-foreground">
            Fetching latest projects, skills, and experience...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;