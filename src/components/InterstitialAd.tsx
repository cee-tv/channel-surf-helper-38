import { useEffect } from "react";
import { Channel } from "@/lib/channels";
import { X } from "lucide-react";

interface InterstitialAdProps {
  onClose: () => void;
  nextChannel: Channel;
}

export const InterstitialAd = ({ onClose, nextChannel }: InterstitialAdProps) => {
  useEffect(() => {
    // Auto-close after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    // Open the geolocation API in a new tab
    window.open('https://api.ipgeolocation.io', '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative overflow-hidden">
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close ad"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>
        
        {/* Ad content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Loading {nextChannel.name}
            </h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
              Ad
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600 text-center">
              Your content will resume shortly...
            </p>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            Click (x) to learn more about our sponsor
          </div>
        </div>
      </div>
    </div>
  );
};