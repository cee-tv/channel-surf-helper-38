import { useState, useRef, useEffect } from "react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ChannelList } from "@/components/ChannelList";
import { ChannelControls } from "@/components/ChannelControls";
import { channels, Channel } from "@/lib/channels";

const Index = () => {
  const [currentChannel, setCurrentChannel] = useState<Channel>(channels[0]);
  const [showChannels, setShowChannels] = useState(false);
  const [showControlGuide, setShowControlGuide] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const changeChannel = (channel: Channel) => {
    setCurrentChannel(channel);
  };

  const handlePreviousChannel = () => {
    const currentIndex = channels.findIndex((c) => c.id === currentChannel.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : channels.length - 1;
    changeChannel(channels[previousIndex]);
  };

  const handleNextChannel = () => {
    const currentIndex = channels.findIndex((c) => c.id === currentChannel.id);
    const nextIndex = currentIndex < channels.length - 1 ? currentIndex + 1 : 0;
    changeChannel(channels[nextIndex]);
  };

  const toggleChannels = () => {
    setShowChannels((prev) => !prev);
    setShowControlGuide(false);
  };

  const toggleControlGuide = () => {
    setShowControlGuide((prev) => !prev);
    setShowChannels(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Auto fullscreen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (containerRef.current && !document.fullscreenElement) {
          await containerRef.current.requestFullscreen();
        }
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    };
    
    enterFullscreen();
  }, []);

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showChannels) {
        // Close channel list on any key press
        setShowChannels(false);
        return;
      }

      if (showControlGuide) {
        // Dismiss control guide on any key press
        setShowControlGuide(false);
        return;
      }

      switch (event.key) {
        case "ArrowUp":
          handlePreviousChannel();
          break;
        case "ArrowDown":
          handleNextChannel();
          break;
        case "ArrowLeft":
          setShowChannels(true);
          break;
        case "ArrowRight":
          setShowControlGuide(true);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentChannel, showChannels, showControlGuide]);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black">
      <VideoPlayer channel={currentChannel} />

      <ChannelControls
        channelName={currentChannel.name}
        onPrevious={handlePreviousChannel}
        onNext={handleNextChannel}
        onShowChannels={toggleChannels}
        onToggleFullscreen={toggleFullscreen}
      />

      {showChannels && (
        <ChannelList
          channels={channels}
          currentChannel={currentChannel}
          onChannelSelect={(channel) => {
            setShowChannels(false);
            changeChannel(channel);
          }}
          onClose={toggleChannels}
        />
      )}

      {showControlGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 text-white">
          <div className="bg-black/90 p-8 rounded-lg space-y-4">
            <h2 className="text-xl font-bold mb-4">Keyboard Controls</h2>
            <p>↑ Previous Channel</p>
            <p>↓ Next Channel</p>
            <p>← Open Channel List</p>
            <p>→ Show This Guide</p>
            <p className="text-sm text-gray-400 mt-4">Press any key to dismiss</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;