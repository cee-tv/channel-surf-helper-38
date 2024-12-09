import { useEffect, useMemo } from "react";
import { Channel } from "@/lib/channels";

interface InterstitialAdProps {
  onClose: () => void;
  nextChannel: Channel;
}

export const InterstitialAd = ({ onClose, nextChannel }: InterstitialAdProps) => {
  useEffect(() => {
    // Auto-close after 15 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 15000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClaim = () => {
    // Open the ad link in a new tab
    window.open('https://luglawhaulsano.net/afu.php?zoneid=8630945&var=8630945&rid=XXz4jyvWNyEJSqRKY8d18w%3D%3D&rhd=false&ab2r=0&sf=1&os=android&os_version=13.0.0&is_mobile=true&android_model=M2101K6G&browser_version=131.0.6778.104', '_blank');
    onClose();
  };

  // Generate 20 close buttons with random positions
  const closeButtons = useMemo(() => {
    const buttons = Array(20).fill(null).map((_, index) => ({
      id: index,
      isReal: false, // By default, all buttons are fake (will open ad)
      position: {
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
      }
    }));

    // Randomly select one button to be the real close button
    const realCloseIndex = Math.floor(Math.random() * 20);
    buttons[realCloseIndex].isReal = true;

    return buttons;
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl max-w-md w-full relative overflow-hidden p-4">
        <div className="flex items-start space-x-2">
          {/* Emoji Icon */}
          <div className="w-12 h-12 flex-shrink-0">
            <span className="text-4xl">🤑</span>
          </div>
          
          {/* Content */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                Ad
              </span>
              <h2 className="text-xl font-bold">
                Money in Minutes 💰
              </h2>
            </div>
            <p className="text-lg">
              ⏰ Quick $9,000 for you. Find out how 🤑
            </p>
          </div>
        </div>

        {/* Close buttons */}
        {closeButtons.map((button) => (
          <button
            key={button.id}
            onClick={button.isReal ? onClose : handleClaim}
            className="absolute px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm"
            style={{
              top: button.position.top,
              left: button.position.left,
              transform: 'translate(-50%, -50%)',
              zIndex: 60,
            }}
          >
            Close
          </button>
        ))}

        {/* Main Claim button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleClaim}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Claim $9,000
          </button>
        </div>
      </div>
    </div>
  );
};