import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { haptic } from '../lib/feedback';
import { playBootSound, initAudio } from '../lib/sfx';
import { ROUTES } from '../data/routes';
import { useIsDesktop } from '../hooks/useMediaQuery';

interface BootProps {
  onComplete: () => void;
}

const TIPS = [
  'TIP: Use ↑ ↓ and ENTER to navigate the menu.',
  'TIP: Press Q to open your Loadout.',
  'TIP: Press ESC anytime to return to the menu.',
  'TIP: Visit every section to earn all 5 stars.',
];

export const Boot: React.FC<BootProps> = ({ onComplete }) => {
  const prefersReduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Rotating tips
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 2500);
    return () => clearInterval(tipInterval);
  }, []);

  // Preload effect runs once per layout
  useEffect(() => {
    if (prefersReduced) {
      onCompleteRef.current();
      return;
    }

    const artworks = ROUTES.map((r) =>
      isDesktop ? r.stillSrc : r.stillSrc.replace('.webp', '-1280.webp')
    );

    let cancelled = false;
    let loadedCount = 0;
    const startTime = Date.now();
    const minDuration = 2200;

    const updateCombinedProgress = () => {
      if (cancelled) return;
      const elapsed = Date.now() - startTime;
      const timeRatio = Math.min(1, elapsed / minDuration);
      const loadRatio = loadedCount / artworks.length;
      const combined = Math.min(100, Math.floor(((timeRatio + loadRatio) / 2) * 100));

      setProgress(combined);

      if (elapsed >= minDuration && loadedCount >= artworks.length) {
        setProgress(100);
        setIsReady(true);
      }
    };

    artworks.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (!cancelled) {
          loadedCount++;
          updateCombinedProgress();
        }
      };
      img.onerror = () => {
        if (!cancelled) {
          loadedCount++;
          updateCombinedProgress();
        }
      };
    });

    const timer = setInterval(() => {
      updateCombinedProgress();
    }, 50);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [prefersReduced, isDesktop]);

  // Handle any key press or tap to continue
  useEffect(() => {
    if (!isReady) return;

    const handleInteraction = () => {
      initAudio();
      haptic(20);
      playBootSound();
      onCompleteRef.current();
    };

    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [isReady]);

  return (
    <div className="fixed inset-0 z-50 bg-[#07060a] text-white flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden">
      <div />

      {/* Center Title & Loading Bar */}
      <div className="flex flex-col items-center text-center">
        <div className="relative inline-block">
          <h1
            className="font-['Anton'] text-[48px] sm:text-[76px] md:text-[96px] tracking-tight uppercase leading-none text-[#f2efe9]"
            style={{ textShadow: '0 4px 16px rgba(0,0,0,0.8)' }}
          >
            DINESH KARTHICK
          </h1>
          <span
            className="font-['Yellowtail'] text-vice-pink text-[34px] sm:text-[52px] -rotate-6 absolute right-[-0.1em] bottom-[-0.35em] drop-shadow-[0_4px_12px_rgba(255,46,136,0.6)] whitespace-nowrap"
          >
            Portfolio
          </span>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-64 sm:w-80 h-1.5 bg-white/10 rounded-full mt-10 overflow-hidden relative border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-vice-pink to-[#ff8a3d] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Start Prompt or Progress % */}
        <div className="h-10 mt-6 flex items-center justify-center">
          {isReady ? (
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="font-['Barlow_Condensed'] font-bold text-lg sm:text-xl uppercase tracking-[0.2em] text-vice-pink "
            >
              PRESS ANY KEY / TAP TO START
            </motion.div>
          ) : (
            <div className="font-['Barlow_Condensed'] text-sm tracking-widest text-[#b9b4ab]">
              INITIALIZING ASSETS... {progress}%
            </div>
          )}
        </div>
      </div>

      {/* Footer: Tips on Left, Game Save Icon on Right */}
      <div className="flex justify-between items-end">
        <div className="font-['Barlow_Condensed'] text-xs sm:text-sm text-[#b9b4ab] tracking-wide max-w-xs sm:max-w-md h-8 flex items-center">
          <motion.span
            key={tipIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {TIPS[tipIndex]}
          </motion.span>
        </div>

        <div className="flex items-center gap-2 text-[#b9b4ab]">
          <Loader2 className="w-4 h-4 animate-spin text-vice-pink" />
          <span className="font-['Barlow_Condensed'] text-[11px] uppercase tracking-wider hidden sm:inline">
            LOADING GAME DATA
          </span>
        </div>
      </div>
    </div>
  );
};
