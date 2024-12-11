import { Channel } from "@/lib/channels";
import { X } from "lucide-react";

interface InterstitialAdProps {
  onClose: () => void;
  nextChannel: Channel;
}

export const InterstitialAd = ({ onClose, nextChannel }: InterstitialAdProps) => {
  const handleClose = () => {
    // Randomly choose between the two URLs
    const urls = [
      'https://luglawhaulsano.net/4/8631414',
      'https://luglawhaulsano.net/4/8630945'
    ];
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    window.open(randomUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl aspect-square mx-auto bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="1" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '30px 30px'
          }}
        />

        {/* Content Container */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <h2 className="text-3xl font-bold text-white">
              Loading {nextChannel.name}
            </h2>
            <span className="px-4 py-1 bg-blue-500/20 text-blue-400 text-sm font-semibold rounded-full border border-blue-500/30">
              Advertisement
            </span>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full flex flex-col items-center justify-center">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop" 
                alt="Advertisement"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-3 hover:bg-white/20 rounded-full transition-all transform hover:scale-110 bg-black/50 backdrop-blur-sm border border-white/20"
            aria-label="Close ad"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Footer Text */}
          <div className="text-center text-sm text-gray-400 font-medium">
            Click the X button to continue watching
          </div>
        </div>
      </div>
    </div>
  );
};