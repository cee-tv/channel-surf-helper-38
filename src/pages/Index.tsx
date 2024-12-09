import { useState, useRef } from "react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ChannelList } from "@/components/ChannelList";
import { ChannelControls } from "@/components/ChannelControls";
import { InterstitialAd } from "@/components/InterstitialAd";
import { channels, Channel } from "@/lib/channels";

const Index = () => {
  const [currentChannel, setCurrentChannel] = useState<Channel>(channels[0]);
  const [showChannels, setShowChannels] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [nextChannel, setNextChannel] = useState<Channel | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const changeChannel = (channel: Channel) => {
    setCurrentChannel(channel); // Update channel immediately
    setNextChannel(channel);
    setShowAd(true);
  };

  const handleAdClose = () => {
    if (nextChannel) {
      setNextChannel(null);
    }
    setShowAd(false);
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
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

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

      {showAd && nextChannel && (
        <InterstitialAd onClose={handleAdClose} nextChannel={nextChannel} />
      )}
    </div>
  );
};

export default Index;