import { useEffect, useState } from "react";
import { Channel } from "@/lib/channels";
import { X } from "lucide-react";
import { Button } from "./ui/button";

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
      <div className="relative w-full h-full max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Real Close Button - Always visible in top-right corner */}
        <Button 
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-50"
          onClick={() => onClose()}
        >
          <X className="h-4 w-4" />
        </Button>

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
            
            <p className="text-gray-600 text-lg">
              Your content will resume in {timeLeft} seconds...
            </p>
          </div>

          {/* Fake Close Buttons */}
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