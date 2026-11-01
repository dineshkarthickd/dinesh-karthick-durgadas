import React, { useState, useEffect, useRef } from 'react';
import { Radio as RadioIcon, Play, Square, VolumeX } from 'lucide-react';

const RADIO_STORAGE_KEY = 'dk_portfolio_radio_playing';

export const Radio: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    try {
      return localStorage.getItem(RADIO_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if /audio/radio.mp3 exists and is a valid audio file
  useEffect(() => {
    fetch('/audio/radio.mp3', { method: 'HEAD' })
      .then((res) => {
        const contentType = res.headers.get('content-type') || '';
        // SPA rewrite returns index.html with text/html, real audio must start with audio/
        if (res.ok && res.status !== 404 && contentType.startsWith('audio/')) {
          setIsAvailable(true);
        } else {
          setIsAvailable(false);
          setIsPlaying(false);
        }
      })
      .catch(() => {
        setIsAvailable(false);
        setIsPlaying(false);
      });
  }, []);

  // Handle audio instance lazily on first play
  useEffect(() => {
    if (isPlaying && isAvailable) {
      if (!audioRef.current) {
        const audio = new Audio('/audio/radio.mp3');
        audio.loop = true;
        audio.volume = 0.35;
        audioRef.current = audio;
      }
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
        setIsAvailable(false);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      localStorage.setItem(RADIO_STORAGE_KEY, String(isPlaying));
    } catch {
      // ignore
    }
  }, [isPlaying, isAvailable]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleRadio = () => {
    if (!isAvailable) return;
    setIsPlaying((prev) => !prev);
  };

  if (isAvailable === false) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-['Barlow_Condensed'] font-bold tracking-wider text-[#b9b4ab] bg-black/60 border border-white/10 backdrop-blur-md opacity-60 cursor-not-allowed">
        <VolumeX size={13} />
        <span>RADIO OFF AIR</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleRadio}
      disabled={isAvailable === null}
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-['Barlow_Condensed'] font-bold tracking-wider border backdrop-blur-md transition-all cursor-pointer ${
        isPlaying
          ? 'bg-black/60 border-[#ff2e88] text-[#ff2e88] shadow-[0_0_12px_rgba(255,46,136,0.35)]'
          : 'bg-black/60 border-white/20 text-[#b9b4ab] hover:border-white/50 hover:text-white'
      }`}
      title={isPlaying ? 'Pause DK FM 104.9' : 'Play DK FM 104.9'}
    >
      <RadioIcon size={14} className={isPlaying ? 'animate-pulse' : ''} />
      <span>DK FM 104.9</span>
      {isPlaying ? (
        <Square size={10} className="fill-current ml-0.5" />
      ) : (
        <Play size={10} className="fill-current ml-0.5" />
      )}
    </button>
  );
};
