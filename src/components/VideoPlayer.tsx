import { Channel } from "@/lib/channels";
import { Volume2, VolumeX, Play, Pause, Maximize2, MonitorSmartphone, Tv, Monitor } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useShaka } from "@/hooks/useShaka";
import { useVideoControls } from "@/hooks/useVideoControls";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [screenMode, setScreenMode] = useState<string>("desktop");

  const getVideoClassName = () => {
    const baseClasses = "transition-all duration-300";
    
    switch (screenMode) {
      case "mobile":
        return `${baseClasses} w-full h-[calc(100vh-4rem)] max-w-[400px] mx-auto object-contain`;
      case "desktop":
        return `${baseClasses} w-full h-full object-contain`;
      case "smarttv":
        return `${baseClasses} w-full h-screen object-cover`;
      case "androidtv":
        return `${baseClasses} w-full h-screen object-contain`;
      case "fit":
        return `${baseClasses} w-full h-full object-fill`;
      default:
        return `${baseClasses} w-full h-full object-contain`;
    }
  };

  if (error) {
    console.error("Video player error:", error);
  }

  return (
    <div 
      className="relative w-full h-full bg-black"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      style={{
        aspectRatio: aspectRatio === "16:9" ? "16/9" : aspectRatio === "4:3" ? "4/3" : "16/9"
      }}
    >
      <video
        ref={videoRef}
        className={getVideoClassName()}
        autoPlay
      />

      {/* Custom Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Monitor className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setScreenMode("mobile")}>
                <MonitorSmartphone className="mr-2 h-4 w-4" />
                Mobile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScreenMode("desktop")}>
                <Monitor className="mr-2 h-4 w-4" />
                Desktop
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScreenMode("smarttv")}>
                <Tv className="mr-2 h-4 w-4" />
                Smart TV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScreenMode("androidtv")}>
                <Tv className="mr-2 h-4 w-4" />
                Android TV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScreenMode("fit")}>
                <Maximize2 className="mr-2 h-4 w-4" />
                Fit to Screen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Maximize2 className="h-6 w-6 rotate-45" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setAspectRatio("16:9")}>
                16:9
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAspectRatio("4:3")}>
                4:3
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};