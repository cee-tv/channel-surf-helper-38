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
          bufferingGoal: 10,
          rebufferingGoal: 5,
          bufferBehind: 20,
          retryParameters: {
            maxAttempts: 2,
            baseDelay: 250,
            backoffFactor: 1.2,
            timeout: 10000
          }
        },
        abr: {
          enabled: true,
          defaultBandwidthEstimate: 5000000,
          switchInterval: 2,
          bandwidthUpgradeTarget: 0.9,
          bandwidthDowngradeTarget: 0.7
        },
        manifest: {
          retryParameters: {
            maxAttempts: 2,
            baseDelay: 250,
            backoffFactor: 1.2,
            timeout: 10000
          }
        }
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