import { useState, useEffect, useRef } from "react";
import { Channel } from "@/lib/channels";
import { SearchBar } from "./SearchBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ChannelListProps {
  channels: Channel[];
  currentChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
  onClose: () => void;
}

export const ChannelList = ({
  channels,
  currentChannel,
  onChannelSelect,
  onClose,
}: ChannelListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedButtonRef = useRef<HTMLButtonElement>(null);

  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) => 
            prev > 0 ? prev - 1 : filteredChannels.length - 1
          );
          break;
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) => 
            prev < filteredChannels.length - 1 ? prev + 1 : 0
          );
          break;
        case "Enter":
          if (filteredChannels[selectedIndex]) {
            onChannelSelect(filteredChannels[selectedIndex]);
          }
          break;
        case "ArrowLeft":
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredChannels, selectedIndex, onChannelSelect, onClose]);

  // Set initial selected index to current channel when list opens
  useEffect(() => {
    if (currentChannel) {
      const currentIndex = filteredChannels.findIndex(
        (channel) => channel.id === currentChannel.id
      );
      if (currentIndex !== -1) {
        setSelectedIndex(currentIndex);
      }
    }
  }, [currentChannel, filteredChannels]);

  // Auto-scroll to keep selected channel in view
  useEffect(() => {
    if (selectedButtonRef.current) {
      selectedButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="absolute left-0 top-0 h-full w-72 bg-black/80 p-4 shadow-xl animate-slide-in-left">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Channels</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <SearchBar onSearch={setSearchQuery} />
        
        <ScrollArea className="h-[calc(100vh-180px)] mt-4 pr-4">
          <div className="space-y-2">
            {filteredChannels.map((channel, index) => (
              <Button
                key={channel.id}
                ref={index === selectedIndex ? selectedButtonRef : null}
                variant={index === selectedIndex ? "secondary" : "ghost"}
                className={`w-full justify-start text-left ${
                  index === selectedIndex
                    ? "bg-white/20 text-white" 
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => onChannelSelect(channel)}
              >
                {channel.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
