import React, { useState, useEffect } from 'react';
import { shouldDisableVideo } from '../lib/videoUtils';

export const VideoPreloader: React.FC<{ artKey: string | null }> = ({ artKey }) => {
  const [preloadKey, setPreloadKey] = useState<string | null>(null);

  useEffect(() => {
    if (!artKey || shouldDisableVideo()) {
      const clearTimer = setTimeout(() => {
        setPreloadKey(null);
      }, 0);
      return () => clearTimeout(clearTimer);
    }

    const timer = setTimeout(() => {
      setPreloadKey(artKey);
    }, 400);

    return () => clearTimeout(timer);
  }, [artKey]);

  if (!preloadKey) return null;

  return (
    <video
      key={preloadKey}
      preload="auto"
      muted
      playsInline
      className="hidden pointer-events-none"
      aria-hidden="true"
    >
      <source src={`/art/video/${preloadKey}.webm`} type="video/webm" />
      <source src={`/art/video/${preloadKey}.mp4`} type="video/mp4" />
    </video>
  );
};
