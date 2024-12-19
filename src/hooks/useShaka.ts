import { useEffect, useRef, useState } from "react";
import { Channel } from "@/lib/channels";

export const useShaka = (channel: Channel) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shakaPlayerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const destroyPlayer = async () => {
    if (shakaPlayerRef.current) {
      try {
        // Cancel any pending requests
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
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
      
      // Create new abort controller for this initialization
      abortControllerRef.current = new AbortController();
      
      const player = new shaka.Player();
      await player.attach(videoRef.current);
      shakaPlayerRef.current = player;

      // Configure network handling
      player.configure({
        streaming: {
          // Increase buffer sizes for stability
          bufferingGoal: 30,
          rebufferingGoal: 15,
          bufferBehind: 30,
          // Aggressive retry settings
          retryParameters: {
            maxAttempts: 8,
            baseDelay: 1000,
            backoffFactor: 2,
            timeout: 60000,
            fuzzFactor: 0.5
          },
          // Disable low latency mode for more stable playback
          lowLatencyMode: false,
          // Reduce segment prefetch to avoid too many parallel requests
          segmentPrefetchLimit: 2,
          // Add gap jumping for smoother playback
          jumpLargeGaps: true,
          smallGapLimit: 1.5,
          // Add stall detection and recovery
          stallThreshold: 1,
          stallSkip: 0.1
        },
        abr: {
          enabled: true,
          defaultBandwidthEstimate: 1000000,
          switchInterval: 8,
          bandwidthUpgradeTarget: 0.9,
          bandwidthDowngradeTarget: 0.7,
          restrictions: {
            minHeight: 360,
            maxHeight: 1080
          }
        },
        manifest: {
          retryParameters: {
            maxAttempts: 8,
            baseDelay: 1000,
            backoffFactor: 2,
            timeout: 60000,
            fuzzFactor: 0.5
          },
          dash: {
            ignoreMinBufferTime: true,
            clockSyncUri: '',
            ignoreSuggestedPresentationDelay: true
          }
        }
      });

      // Enhanced error handling
      player.addEventListener("error", async (event: any) => {
        console.error("Player error:", event.detail);
        
        // Only set error if it's not an abort error
        if (event.detail.code !== 7000 && event.detail.code !== 1001) {
          setError(event.detail.message);
          
          // Attempt recovery
          try {
            await player.retryStreaming();
          } catch (retryError) {
            console.error("Recovery failed:", retryError);
            if (videoRef.current) {
              videoRef.current.load();
            }
          }
        }
      });

      // Add buffering event listeners
      videoRef.current.addEventListener('waiting', () => setIsLoading(true));
      videoRef.current.addEventListener('playing', () => setIsLoading(false));
      videoRef.current.addEventListener('canplay', () => setIsLoading(false));

      // Add stall detection
      videoRef.current.addEventListener('stalled', async () => {
        try {
          await player.retryStreaming();
        } catch (error) {
          console.error("Stall recovery failed:", error);
        }
      });

      if (channel.drmKey) {
        const [keyId, key] = channel.drmKey.split(':');
        await player.configure({
          drm: {
            clearKeys: {
              [keyId]: key
            },
            retryParameters: {
              maxAttempts: 5,
              baseDelay: 1000,
              backoffFactor: 2,
              fuzzFactor: 0.5
            }
          }
        });
      }

      // Optimize video element settings
      if (videoRef.current) {
        videoRef.current.preload = "auto";
        videoRef.current.autoplay = true;
      }

      await player.load(channel.url, null, 'video/mp4');
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