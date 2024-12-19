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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showControlGuide) {
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
          if (showChannels) {
            setShowChannels(false);
          } else {
            setShowControlGuide(true);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showChannels, showControlGuide]);

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
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in"
          onClick={() => setShowControlGuide(false)}
        >
          <div className="bg-black/90 p-8 rounded-lg border border-white/20 text-white space-y-4">
            <h2 className="text-xl font-semibold mb-4">Keyboard Controls</h2>
            <div className="space-y-2">
              <p>⬆️ Arrow Up: Previous Channel</p>
              <p>⬇️ Arrow Down: Next Channel</p>
              <p>⬅️ Arrow Left: Open Channel List</p>
              <p>➡️ Arrow Right: Show/Hide Controls Guide</p>
            </div>
            <p className="text-sm text-gray-400 mt-4">Press any key to close</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;