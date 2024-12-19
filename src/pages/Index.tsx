import { useState, useRef, useEffect } from "react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ChannelList } from "@/components/ChannelList";
import { ChannelControls } from "@/components/ChannelControls";
import { channels, Channel } from "@/lib/channels";

const Index = () => {
  const [currentChannel, setCurrentChannel] = useState<Channel>(channels[0]);
  const [showChannels, setShowChannels] = useState(false);
  const [showControlGuide, setShowControlGuide] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastKeyPressTime = useRef<number>(0);

  const changeChannel = (channel: Channel) => {
    setCurrentChannel(channel);
  };

  const handlePreviousChannel = () => {
    const now = Date.now();
    if (now - lastKeyPressTime.current < 300) return;
    lastKeyPressTime.current = now;

    const currentIndex = channels.findIndex((c) => c.id === currentChannel.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : channels.length - 1;
    changeChannel(channels[previousIndex]);
  };

  const handleNextChannel = () => {
    const now = Date.now();
    if (now - lastKeyPressTime.current < 300) return;
    lastKeyPressTime.current = now;

    const currentIndex = channels.findIndex((c) => c.id === currentChannel.id);
    const nextIndex = currentIndex < channels.length - 1 ? currentIndex + 1 : 0;
    changeChannel(channels[nextIndex]);
  };

  const toggleChannels = () => {
    setShowChannels((prev) => !prev);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

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

  // Auto-hide control guide after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControlGuide(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          handlePreviousChannel();
          break;
        case "ArrowDown":
          handleNextChannel();
          break;
        case "ArrowLeft":
          if (!showChannels) {
            setShowChannels(true);
          }
          setShowControlGuide(false);
          break;
        case "ArrowRight":
          setShowControlGuide((prev) => !prev);
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
          onClose={() => setShowChannels(false)}
        />
      )}

      {showControlGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center animate-fade-in">
          <div className="bg-black/90 p-8 rounded-lg max-w-md text-white space-y-4">
            <h2 className="text-xl font-semibold mb-4">Keyboard Controls</h2>
            <div className="space-y-2">
              <p>⬆️ Previous Channel</p>
              <p>⬇️ Next Channel</p>
              <p>⬅️ Show/Hide Channel List</p>
              <p>➡️ Show/Hide Controls Guide</p>
            </div>
            <p className="text-sm text-gray-400 mt-4">Press right arrow to toggle guide</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;