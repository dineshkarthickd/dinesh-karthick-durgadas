import React, { useState, useEffect, useRef } from 'react';
import { loadManifest, shouldDisableVideo } from '../lib/videoUtils';
import { useIsDesktop } from '../hooks/useMediaQuery';

interface LivingBackgroundProps {
  stillSrc: string;
  artKey: string;
  focusX?: string;
  focusY?: string;
  alt: string;
  isActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const LivingBackground: React.FC<LivingBackgroundProps> = ({
  stillSrc,
  artKey,
  focusX = '75%',
  focusY = '0%',
  alt,
  isActive = true,
  className = 'w-full h-full object-cover',
  style,
}) => {
  const [canRenderVideo, setCanRenderVideo] = useState<boolean>(false);
  const [loadedArtKey, setLoadedArtKey] = useState<string | null>(null);
  const [failedArtKey, setFailedArtKey] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isIntersectingRef = useRef<boolean>(true);

  const videoLoaded = loadedArtKey === artKey;
  const videoFailed = failedArtKey === artKey;

  // Check manifest & network conditions
  useEffect(() => {
    let active = true;
    if (shouldDisableVideo()) {
      return;
    }

    loadManifest().then((manifest) => {
      if (active) {
        setCanRenderVideo(manifest.has(artKey));
      }
    });

    return () => {
      active = false;
    };
  }, [artKey]);

  // Handle active playback, visibility change, and intersection
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    if (!isActive) {
      video.pause();
      return;
    }

    const checkPlay = () => {
      if (
        isActive &&
        document.visibilityState === 'visible' &&
        isIntersectingRef.current
      ) {
        video.play().catch(() => {
          // autoplay was prevented
        });
      } else {
        video.pause();
      }
    };

    checkPlay();

    const handleVisibility = () => {
      checkPlay();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let observer: IntersectionObserver | null = null;
    if (containerRef.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isIntersectingRef.current = entry.isIntersecting;
            checkPlay();
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (observer) observer.disconnect();
    };
  }, [isActive, canRenderVideo, videoFailed]);

  const handleCanPlay = () => {
    if (videoFailed) return;
    setLoadedArtKey(artKey);
    if (isActive && videoRef.current && isIntersectingRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleVideoFailure = () => {
    setFailedArtKey(artKey);
  };

  const isDesktop = useIsDesktop();
  const baseSrc = stillSrc.replace(/-1280\.webp$/, '.webp');
  const defaultStill = isDesktop ? baseSrc : baseSrc.replace(/\.webp$/, '-1280.webp');
  const responsiveSrcSet = `/art/${artKey}-1280.webp 1280w, /art/${artKey}.webp 2560w`;

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden" style={style}>
      {/* 1. Still image (immediate poster and solid fallback for reduced motion / Save-Data) */}
      <img
        src={defaultStill}
        srcSet={responsiveSrcSet}
        sizes="100vw"
        alt={alt}
        className={className}
        style={{
          objectPosition: `${focusX} ${focusY}`,
        }}
      />

      {/* 2. Poster layer under video (exact matching 720p frame so video fades in seamlessly without softening 4K) */}
      {canRenderVideo && !videoFailed && (
        <img
          src={`/art/video/${artKey}-poster.webp`}
          alt=""
          aria-hidden="true"
          className={`${className} absolute inset-0 pointer-events-none`}
          style={{
            objectPosition: `${focusX} ${focusY}`,
          }}
        />
      )}

      {/* 3. Living Video Layer (MP4 first for Safari/iOS compatibility, then WebM) */}
      {canRenderVideo && !videoFailed && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          disablePictureInPicture
          poster={`/art/video/${artKey}-poster.webp`}
          onCanPlay={handleCanPlay}
          onCanPlayThrough={handleCanPlay}
          onError={handleVideoFailure}
          className={`${className} absolute inset-0 transition-opacity duration-600`}
          style={{
            objectPosition: `${focusX} ${focusY}`,
            opacity: videoLoaded ? 1 : 0,
          }}
        >
          <source src={`/art/video/${artKey}.mp4`} type="video/mp4" />
          <source src={`/art/video/${artKey}.webm`} type="video/webm" />
        </video>
      )}
    </div>
  );
};
