import { Channel } from "@/lib/channels";
import { Volume2, VolumeX, Play, Pause, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useShaka } from "@/hooks/useShaka";
import { useVideoControls } from "@/hooks/useVideoControls";
import { useState } from "react";

interface VideoPlayerProps {
  channel: Channel;
}

export const VideoPlayer = ({ channel }: VideoPlayerProps) => {
  const { videoRef, isLoading, error } = useShaka(channel);
  const {
    isPlaying,
    volume,
    isMuted,
    isFullscreen,
    showControls,
    setShowControls,
    togglePlay,
    toggleMute,
    updateVolume
  } = useVideoControls();

  const [showGuide, setShowGuide] = useState(false);

  const handleScreenClick = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.error("Error attempting to enable fullscreen:", err);
    }
  };

  const handleDoubleClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handleDoubleRightArrow = () => {
    setShowGuide(true);
    setTimeout(() => setShowGuide(false), 3000); // Hide after 3 seconds
  };

  return (
    <div 
      className="relative w-full h-full bg-black"
      onMouseEnter={() => !isFullscreen && setShowControls(true)}
      onMouseLeave={() => !isFullscreen && setShowControls(false)}
      onClick={handleScreenClick}
      onDoubleClick={handleDoubleClick}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        autoPlay
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-16 h-16 text-white animate-spin" />
            <span className="text-white text-lg font-medium">Loading channel...</span>
          </div>
        </div>
      )}

      {/* Keyboard Controls Guide */}
      {showGuide && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 p-6 rounded-lg z-50">
          <div className="text-white space-y-2">
            <h3 className="text-lg font-bold mb-4">Keyboard Controls</h3>
            <p>↑ Previous Channel</p>
            <p>↓ Next Channel</p>
            <p>← Show Channel List</p>
            <p>→ Hide Channel List</p>
          </div>
        </div>
      )}

      {/* Persistent Controls */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay(videoRef);
            }}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute(videoRef);
            }}
          >
            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </Button>

          <div className="w-24" onClick={(e) => e.stopPropagation()}>
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              className="cursor-pointer"
              onValueChange={(value) => updateVolume(videoRef, value[0] / 100)}
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 ml-auto"
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleDoubleRightArrow();
            }}
          >
            <span className="font-bold">⏩</span>
          </Button>
        </div>
      </div>
    </div>
  );
};