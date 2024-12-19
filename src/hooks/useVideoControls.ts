import { useState, useEffect, useCallback } from "react";

export const useVideoControls = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const togglePlay = useCallback((videoRef: React.RefObject<HTMLVideoElement>) => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback((videoRef: React.RefObject<HTMLVideoElement>) => {
    if (!videoRef.current) return;
    
    const newMuted = !isMuted;
    const newVolume = newMuted ? 0 : 1;
    
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newMuted);
  }, [isMuted]);

  const updateVolume = useCallback((videoRef: React.RefObject<HTMLVideoElement>, newVolume: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
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