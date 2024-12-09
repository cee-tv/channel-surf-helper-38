import { useEffect } from "react";
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
    window.open('https://luglawhaulsano.net/4/8630945', '_blank');
    onClose();
  };

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

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleClaim}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Claim $9,000
          </button>
        </div>
      </div>
    </div>
  );
};