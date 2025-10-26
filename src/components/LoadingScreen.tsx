import { Spinner } from "@/components/ui/spinner";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center glass-panel">
      {/* Floating Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      
      <div className="relative z-10 text-center space-y-6">
        <div className="animate-fadeInUp">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
            Manuth <span className="text-primary">Lochana</span>
          </h1>
        </div>
        
        <div className="animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
          <Spinner size="lg" variant="default" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;