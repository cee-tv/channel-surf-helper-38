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
      <div className="relative w-full max-w-2xl aspect-square mx-auto bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-lg shadow-xl overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="1" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '30px 30px'
          }}
        />

        {/* Content Container */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">
                Special Offer!
              </h2>
              <p className="text-white/90 text-lg">
                Exclusive deals from your favorite shops
              </p>
            </div>
            <span className="px-4 py-1 bg-white/20 text-white text-sm font-semibold rounded-full border border-white/30">
              Limited Time
            </span>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full flex flex-col items-center justify-center space-y-6">
            {/* Logos Grid */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-white/90 p-4 rounded-lg text-center">
                <h3 className="font-bold text-pink-600 text-xl">Shopee</h3>
                <p className="text-gray-600">Up to 90% OFF</p>
              </div>
              <div className="bg-white/90 p-4 rounded-lg text-center">
                <h3 className="font-bold text-orange-600 text-xl">Lazada</h3>
                <p className="text-gray-600">Flash Sale!</p>
              </div>
              <div className="bg-white/90 p-4 rounded-lg text-center">
                <h3 className="font-bold text-black text-xl">SHEIN</h3>
                <p className="text-gray-600">New User Bonus</p>
              </div>
              <div className="bg-white/90 p-4 rounded-lg text-center">
                <h3 className="font-bold text-green-600 text-xl">GCash</h3>
                <p className="text-gray-600">₱1000 Giveaway!</p>
              </div>
            </div>

            {/* Promo Text */}
            <div className="text-center bg-white/20 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-white text-lg font-bold">
                🎁 Claim Your Rewards Now! 🎁
              </p>
              <p className="text-white/90">
                Don't miss out on these amazing deals
              </p>
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
          <div className="text-center text-sm text-white font-medium">
            Click the X button to claim your rewards
          </div>
        </div>
      </div>
    </div>
  );
};