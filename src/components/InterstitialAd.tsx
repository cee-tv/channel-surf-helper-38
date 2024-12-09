import { useEffect, useState } from "react";
import { Channel } from "@/lib/channels";
import { X } from "lucide-react";

interface InterstitialAdProps {
  onClose: () => void;
  nextChannel: Channel;
}

export const InterstitialAd = ({ onClose, nextChannel }: InterstitialAdProps) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [buttons, setButtons] = useState<Array<{ id: number; isReal: boolean; position: { top: string; left: string } }>>();

  useEffect(() => {
    // Auto-close after 10 seconds
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Generate 5 buttons with random positions, avoiding the header and footer areas
    const generateButtons = () => {
      const realButtonIndex = Math.floor(Math.random() * 5);
      
      // Define safe zones for button placement (avoiding header and footer)
      const safeZones = [
        { minTop: 25, maxTop: 75 }, // Middle section
      ];
      
      // Calculate positions ensuring minimum distance between buttons
      const usedPositions: Array<{ top: number; left: number }> = [];
      const minDistance = 100; // Minimum pixel distance between buttons
      
      return Array.from({ length: 5 }, (_, index) => {
        let position;
        let attempts = 0;
        const maxAttempts = 50;
        
        do {
          const safeZone = safeZones[Math.floor(Math.random() * safeZones.length)];
          const top = Math.random() * (safeZone.maxTop - safeZone.minTop) + safeZone.minTop;
          const left = Math.random() * 80 + 10;
          
          position = { top, left };
          attempts++;
          
          // Check if position is far enough from other buttons
          const isFarEnough = usedPositions.every(usedPos => {
            const distance = Math.sqrt(
              Math.pow(position.top - usedPos.top, 2) + 
              Math.pow(position.left - usedPos.left, 2)
            );
            return distance >= minDistance;
          });
          
          if (isFarEnough || attempts >= maxAttempts) {
            usedPositions.push(position);
            break;
          }
        } while (attempts < maxAttempts);
        
        return {
          id: index,
          isReal: index === realButtonIndex,
          position: {
            top: `${position.top}%`,
            left: `${position.left}%`,
          }
        };
      });
    };

    setButtons(generateButtons());

    return () => clearInterval(timer);
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
      <div className="relative w-full h-full max-w-6xl mx-auto bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg shadow-xl overflow-hidden">
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
          <div className="flex items-center justify-between w-full max-w-4xl">
            <h2 className="text-3xl font-bold text-white">
              Loading {nextChannel.name}
            </h2>
            <span className="px-4 py-1 bg-blue-500/20 text-blue-400 text-sm font-semibold rounded-full border border-blue-500/30">
              Advertisement
            </span>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center space-y-8">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop" 
                alt="Advertisement"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 rounded-full">
                <span className="text-white font-medium">{timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* Fake Close Buttons */}
          {buttons?.map((button) => (
            <button
              key={button.id}
              onClick={() => handleButtonClick(button.isReal)}
              className="absolute p-3 hover:bg-white/10 rounded-full transition-all transform hover:scale-110 bg-white/5 backdrop-blur-sm border border-white/20"
              style={{
                top: button.position.top,
                left: button.position.left,
              }}
              aria-label="Close ad"
            >
              <X className="h-6 w-6 text-white/80" />
            </button>
          ))}

          {/* Footer Text */}
          <div className="text-center text-sm text-gray-400 font-medium mt-4">
            Find the correct close button to continue
          </div>
        </div>
      </div>
    </div>
  );
};