import { useState, useRef, useEffect, useCallback } from "react";

export const useVideoControls = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const togglePlay = useCallback((videoRef: React.RefObject<HTMLVideoElement>) => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback((videoRef: React.RefObject<HTMLVideoElement>) => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      setVolume(1);
      videoRef.current.volume = 1;
    } else {
      setVolume(0);
      videoRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  }, [isMuted]);

  const updateVolume = useCallback((videoRef: React.RefObject<HTMLVideoElement>, newVolume: number) => {
    if (!videoRef.current) return;
    
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  }, []);

  return {
    isPlaying,
    volume,
    isMuted,
    isFullscreen,
    showControls,
    setShowControls,
    togglePlay,
    toggleMute,
    updateVolume
  };
};