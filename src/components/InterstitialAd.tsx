import { useEffect, useState } from "react";
import { Channel } from "@/lib/channels";
import { X } from "lucide-react";

interface InterstitialAdProps {
  onClose: () => void;
  nextChannel: Channel;
}

export const InterstitialAd = ({ onClose, nextChannel }: InterstitialAdProps) => {
  const [buttons, setButtons] = useState<Array<{ id: number; isReal: boolean; position: { top: string; left: string } }>>();

  useEffect(() => {
    // Auto-close after 15 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 15000);

    // Generate 5 buttons with random positions
    const generateButtons = () => {
      const realButtonIndex = Math.floor(Math.random() * 5);
      return Array.from({ length: 5 }, (_, index) => ({
        id: index,
        isReal: index === realButtonIndex,
        position: {
          top: `${Math.random() * 80 + 10}%`,
          left: `${Math.random() * 80 + 10}%`,
        }
      }));
    };

    setButtons(generateButtons());

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleButtonClick = (isReal: boolean) => {
    if (isReal) {
      onClose();
    } else {
      window.open('https://luglawhaulsano.net/4/8630945', '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="relative w-full h-full max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop)'
          }}
        />

        {/* Content Container */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 space-y-6">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-2xl font-bold text-gray-900">
              Loading {nextChannel.name}
            </h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full">
              Ad
            </span>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full flex flex-col items-center justify-center space-y-8">
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop" 
              alt="Advertisement"
              className="w-full max-w-2xl rounded-lg shadow-lg"
            />
            
            <p className="text-gray-600 text-lg animate-pulse">
              Your content will resume in 15 seconds...
            </p>
          </div>

          {/* Close Buttons */}
          {buttons?.map((button) => (
            <button
              key={button.id}
              onClick={() => handleButtonClick(button.isReal)}
              className="absolute p-3 hover:bg-gray-100 rounded-full transition-all transform hover:scale-110 bg-white shadow-lg"
              style={{
                top: button.position.top,
                left: button.position.left,
              }}
              aria-label="Close ad"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          ))}

          {/* Footer Text */}
          <div className="text-center text-sm text-gray-500 font-medium mt-4">
            Find the real close button
          </div>
        </div>
      </div>
    </div>
  );
};