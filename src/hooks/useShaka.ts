import { useEffect, useRef, useState } from "react";
import { Channel } from "@/lib/channels";

export const useShaka = (channel: Channel) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shakaPlayerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const destroyPlayer = async () => {
    if (shakaPlayerRef.current) {
      try {
        await shakaPlayerRef.current.destroy();
        shakaPlayerRef.current = null;
      } catch (error) {
        console.error("Error destroying player:", error);
      }
    }
  };

  const initPlayer = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // @ts-ignore
      const shaka = window.shaka;
      if (!videoRef.current || !shaka) {
        throw new Error("Video element or Shaka not available");
      }

      await destroyPlayer();
      const player = new shaka.Player();
      await player.attach(videoRef.current);
      shakaPlayerRef.current = player;

      // Optimize buffering and playback
      player.configure({
        streaming: {
          bufferingGoal: 10, // Reduced from 30 for faster initial load
          rebufferingGoal: 5, // Reduced from 15 for faster recovery
          bufferBehind: 20, // Reduced from 30 to free up memory
          retryParameters: {
            maxAttempts: 2, // Reduced from 3 for faster fallback
            baseDelay: 250, // Reduced from 500 for faster retry
            backoffFactor: 1.2, // Reduced from 1.5 for faster retry progression
            timeout: 10000 // Reduced from 20000 for faster timeout
          }
        },
        abr: {
          enabled: true,
          defaultBandwidthEstimate: 5000000, // Increased for faster initial quality
          switchInterval: 2, // Reduced from 4 for faster quality switches
          bandwidthUpgradeTarget: 0.9, // Increased from 0.85 for faster quality upgrades
          bandwidthDowngradeTarget: 0.7 // Reduced from 0.95 for faster downgrades
        },
        manifest: {
          retryParameters: {
            maxAttempts: 2,
            baseDelay: 250,
            backoffFactor: 1.2,
            timeout: 10000
          }
        },
        preferNativeHls: true // Enable native HLS playback when available
      });

      player.addEventListener("error", (event: any) => {
        console.error("Player error:", event.detail);
        setError(event.detail.message);
      });

      // Add buffering event listeners
      videoRef.current.addEventListener('waiting', () => setIsLoading(true));
      videoRef.current.addEventListener('playing', () => setIsLoading(false));
      videoRef.current.addEventListener('canplay', () => setIsLoading(false));

      if (channel.drmKey) {
        const [keyId, key] = channel.drmKey.split(':');
        await player.configure({
          drm: {
            clearKeys: {
              [keyId]: key
            },
            retryParameters: {
              maxAttempts: 2,
              baseDelay: 250,
              backoffFactor: 1.2,
              fuzzFactor: 0.5
            }
          }
        });
      }

      // Set low latency mode for faster playback
      if (videoRef.current) {
        videoRef.current.preload = "auto";
        videoRef.current.autoplay = true;
      }

      await player.load(channel.url);
      if (videoRef.current) {
        videoRef.current.play();
      }
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error initializing player:", error);
      setError(error.message || "Failed to load video");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/shaka-player@4.7.11/dist/shaka-player.compiled.js';
    script.async = true;
    script.onload = () => {
      initPlayer();
    };
    document.body.appendChild(script);

    return () => {
      destroyPlayer();
      document.body.removeChild(script);
    };
  }, [channel]);

  return { videoRef, isLoading, error };
};