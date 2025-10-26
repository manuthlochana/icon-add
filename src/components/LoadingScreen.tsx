import { Spinner } from "@/components/ui/spinner";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Floating Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        <div className="animate-fadeInUp">
          <div className="w-16 h-16 md:w-20 md:h-20 relative">
            <Spinner size="xl" variant="default" className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;