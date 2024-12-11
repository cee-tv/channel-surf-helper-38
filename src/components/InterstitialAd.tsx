import { Channel } from "@/lib/channels";
import { X } from "lucide-react";

interface InterstitialAdProps {
  onClose: () => void;
  nextChannel: Channel;
}

interface OfferType {
  name: string;
  title: string;
  description: string;
  textColor: string;
}

export const InterstitialAd = ({ onClose, nextChannel }: InterstitialAdProps) => {
  const offers: OfferType[] = [
    {
      name: "Shopee",
      title: "Shopee Flash Sale!",
      description: "Up to 90% OFF",
      textColor: "text-pink-600"
    },
    {
      name: "Lazada",
      title: "Lazada Mega Sale",
      description: "Flash Sale!",
      textColor: "text-orange-600"
    },
    {
      name: "SHEIN",
      title: "SHEIN Special",
      description: "New User Bonus",
      textColor: "text-black"
    },
    {
      name: "GCash",
      title: "GCash Promo",
      description: "₱1000 Giveaway!",
      textColor: "text-green-600"
    }
  ];

  // Select a random offer
  const randomOffer = offers[Math.floor(Math.random() * offers.length)];

  const handleClose = () => {
    window.open('https://luglawhaulsano.net/4/8638426', '_blank');
    onClose();
  };

  const handleContentClick = () => {
    window.open('https://luglawhaulsano.net/4/8631414', '_blank');
  };

  const handleOfferClick = () => {
    window.open('https://luglawhaulsano.net/4/8630945', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md aspect-video mx-auto bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-lg shadow-xl overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="1" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '30px 30px'
          }}
        />

        {/* Content Container */}
        <div className="relative h-full flex flex-col items-center justify-center p-6 space-y-4" onClick={handleContentClick}>
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">
                Special Offer!
              </h2>
              <p className="text-white/90 text-sm">
                Exclusive deal just for you
              </p>
            </div>
            <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full border border-white/30">
              Limited Time
            </span>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full flex flex-col items-center justify-center space-y-4">
            {/* Single Offer Display */}
            <div className="w-full" onClick={handleOfferClick}>
              <div className="bg-white/90 p-6 rounded-lg text-center transform hover:scale-105 transition-transform cursor-pointer">
                <h3 className={`font-bold ${randomOffer.textColor} text-2xl mb-2`}>
                  {randomOffer.title}
                </h3>
                <p className="text-gray-600 text-lg">
                  {randomOffer.description}
                </p>
              </div>
            </div>

            {/* Promo Text */}
            <div className="text-center bg-white/20 backdrop-blur-sm p-3 rounded-lg">
              <p className="text-white text-base font-bold">
                🎁 Claim Your {randomOffer.name} Reward Now! 🎁
              </p>
              <p className="text-white/90 text-sm">
                Don't miss out on this amazing deal
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-2 hover:bg-white/20 rounded-full transition-all transform hover:scale-110 bg-black/50 backdrop-blur-sm border border-white/20"
            aria-label="Close ad"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          {/* Footer Text */}
          <div className="text-center text-xs text-white font-medium">
            Click anywhere to claim your rewards
          </div>
        </div>
      </div>
    </div>
  );
};