import React, { useState, useEffect, useRef } from 'react';
import { loadManifest, shouldDisableVideo } from '../lib/videoUtils';

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
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isIntersectingRef = useRef<boolean>(true);

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
    if (!video) return;

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
  }, [isActive, canRenderVideo]);

  const handleCanPlayThrough = () => {
    setVideoLoaded(true);
    if (isActive && videoRef.current && isIntersectingRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const responsiveSrcSet = `/art/${artKey}-1280.webp 1280w, /art/${artKey}.webp 2560w`;

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden" style={style}>
      {/* 1. Still image (immediate poster and solid fallback for reduced motion / Save-Data) */}
      <img
        src={stillSrc}
        srcSet={responsiveSrcSet}
        sizes="(max-width: 1024px) 1280px, 2560px"
        alt={alt}
        className={className}
        style={{
          objectPosition: `${focusX} ${focusY}`,
        }}
      />

      {/* 2. Poster layer under video (exact matching 720p frame so video fades in seamlessly without softening 4K) */}
      {canRenderVideo && (
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

      {/* 3. Living Video Layer (WebM + MP4 fallback) */}
      {canRenderVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          disablePictureInPicture
          poster={`/art/video/${artKey}-poster.webp`}
          onCanPlayThrough={handleCanPlayThrough}
          className={`${className} absolute inset-0 transition-opacity duration-600`}
          style={{
            objectPosition: `${focusX} ${focusY}`,
            opacity: videoLoaded ? 1 : 0,
          }}
        >
          <source src={`/art/video/${artKey}.webm`} type="video/webm" />
          <source src={`/art/video/${artKey}.mp4`} type="video/mp4" />
        </video>
      )}
    </div>
  );
};
