import { Channel } from "@/lib/channels";
import { Volume2, VolumeX, Play, Pause, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useShaka } from "@/hooks/useShaka";
import { useVideoControls } from "@/hooks/useVideoControls";

interface VideoPlayerProps {
  channel: Channel;
}

export const VideoPlayer = ({ channel }: VideoPlayerProps) => {
  const { videoRef, isLoading, error } = useShaka(channel);
  const {
    isPlaying,
    volume,
    isMuted,
    showControls,
    setShowControls,
    togglePlay,
    toggleMute,
    updateVolume
  } = useVideoControls();

  const handleVideoClick = async (event: React.MouseEvent) => {
    // Prevent click from triggering when clicking controls
    if ((event.target as HTMLElement).closest('.video-controls')) {
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await videoRef.current?.parentElement?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  if (error) {
    console.error("Video player error:", error);
  }

  return (
    <div 
      className="relative w-full h-full bg-black cursor-pointer group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={handleVideoClick}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        autoPlay
      />

      {/* Buffering Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}

      {/* Custom Controls */}
      <div className={`video-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 z-50 ${showControls ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => togglePlay(videoRef)}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => toggleMute(videoRef)}
          >
            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </Button>

          <div className="w-24">
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              className="cursor-pointer"
              onValueChange={(value) => updateVolume(videoRef, value[0] / 100)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};