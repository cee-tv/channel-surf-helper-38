import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";

interface ChannelControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onShowChannels: () => void;
  channelName: string;
}

export const ChannelControls = ({
  onPrevious,
  onNext,
  onShowChannels,
  channelName,
}: ChannelControlsProps) => {
  return (
    <>
      <div className="absolute top-4 left-4 z-[55]">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
          onClick={onShowChannels}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      <div className={`absolute top-4 right-4 z-[55] flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm ${document.fullscreenElement ? 'opacity-100' : ''}`}>
        <span className="text-white font-medium">{channelName}</span>
      </div>

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-[55] flex justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
          onClick={onPrevious}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
          onClick={onNext}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
    </>
  );
};