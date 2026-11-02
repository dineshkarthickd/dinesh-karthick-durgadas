import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useProgress, useGameActions } from '../game/GameContext';
import { haptic } from '../lib/feedback';
import { playMissionPassedSound } from '../lib/sfx';

export const MissionPassed: React.FC = () => {
  const { missionPassed, missionCompleteShown } = useProgress();
  const { awardMissionComplete } = useGameActions();
  const location = useLocation();

  const [popupActive, setPopupActive] = useState<boolean>(false);
  const [completeBannerActive, setCompleteBannerActive] = useState<boolean>(false);

  // Section mission passed popup
  useEffect(() => {
    if (missionPassed) {
      haptic([20, 40, 20]);
      playMissionPassedSound();
      const openTimer = setTimeout(() => {
        setPopupActive(true);
      }, 0);
      const closeTimer = setTimeout(() => {
        setPopupActive(false);
      }, 2000);
      return () => {
        clearTimeout(openTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [missionPassed]);

  // Keep latest shown status in a ref so the effect only triggers on pathname change
  const missionCompleteShownRef = useRef(missionCompleteShown);
  useEffect(() => {
    missionCompleteShownRef.current = missionCompleteShown;
  }, [missionCompleteShown]);

  const awardRef = useRef(awardMissionComplete);
  useEffect(() => {
    awardRef.current = awardMissionComplete;
  }, [awardMissionComplete]);

  // Mission Complete route large centered banner (runs on route change to /mission-complete)
  useEffect(() => {
    if (location.pathname === '/mission-complete' && !missionCompleteShownRef.current) {
      missionCompleteShownRef.current = true;
      awardRef.current();
      haptic([30, 50, 30, 50, 30]);
      playMissionPassedSound();
      const openTimer = setTimeout(() => {
        setCompleteBannerActive(true);
      }, 0);
      const closeTimer = setTimeout(() => {
        setCompleteBannerActive(false);
      }, 3500);
      return () => {
        clearTimeout(openTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [location.pathname]);

  return (
    <>
      {/* Desktop (lg): Left side below top HUD strip above content panel (never overlaps face at right) */}
      <div
        className="hidden lg:block fixed z-40 pointer-events-none select-none"
        style={{
          top: '58px',
          left: 'var(--frame-x)',
        }}
      >
        <AnimatePresence>
          {popupActive && (
            <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: [0.9, 1.03, 1],
                boxShadow: [
                  '0 8px 30px rgba(0,0,0,0.9)',
                  '0 0 40px rgba(255,194,61,0.85), 0 8px 30px rgba(0,0,0,0.9)',
                  '0 0 20px rgba(255,194,61,0.4), 0 8px 30px rgba(0,0,0,0.9)',
                ],
              }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#0a0a0e]/95 border-l-4 border-[#ffc23d] px-3.5 py-1.5 2xl:px-4 2xl:py-2 rounded-r-lg shadow-[0_8px_30px_rgba(0,0,0,0.9)] backdrop-blur-md flex items-center gap-3"
            >
              <span
                className="font-['Anton'] text-[18px] 2xl:text-[22px] tracking-wide text-[#ffc23d] uppercase leading-none skew-btn"
                style={{ textShadow: '1px 1px 0 #000' }}
              >
                MISSION PASSED
              </span>
              <div className="flex items-center gap-2 font-['Barlow_Condensed'] font-bold text-xs 2xl:text-sm tracking-wider uppercase">
                <span className="text-white drop-shadow">RESPECT +</span>
                <span className="text-[#5fd068] drop-shadow">+$100</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stacked Layout (NOT lg): Compact toast under the 60px/68px HUD bar */}
      <div
        className="lg:hidden fixed z-40 pointer-events-none select-none"
        style={{
          top: 'calc(64px + env(safe-area-inset-top, 0px) + 6px)',
          right: 'var(--gutter-x)',
        }}
      >
        <AnimatePresence>
          {popupActive && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.8 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: [0.8, 1.05, 1],
                boxShadow: [
                  '0 4px 16px rgba(0,0,0,0.8)',
                  '0 0 30px rgba(255,194,61,0.8), 0 4px 16px rgba(0,0,0,0.8)',
                  '0 0 16px rgba(255,194,61,0.35), 0 4px 16px rgba(0,0,0,0.8)',
                ],
              }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-10 sm:h-11 px-3.5 rounded-lg bg-[#0a0a0e]/95 border-l-4 border-[#ffc23d] shadow-[0_4px_16px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center gap-2"
            >
              <span
                className="font-['Anton'] text-base sm:text-lg tracking-wider text-[#ffc23d] uppercase leading-none skew-btn"
                style={{ textShadow: '1px 1px 0 #000' }}
              >
                MISSION PASSED
              </span>
              <span className="text-white font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider">
                RESPECT +
              </span>
              <span className="text-[#5fd068] font-['Barlow_Condensed'] font-bold text-xs tracking-wider">
                +$100
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mission Complete Large Screen Banner (centered) */}
      <AnimatePresence>
        {completeBannerActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none select-none bg-black/40 backdrop-blur-sm"
          >
            <div className="relative flex flex-col items-center mx-[var(--m-gutter)] max-w-[calc(100vw-2*var(--m-gutter))] px-4 py-5 sm:px-8 sm:py-6 rounded-2xl bg-[#07060a]/90 border-2 border-vice-pink shadow-[0_0_80px_rgba(255,46,136,0.6)] text-center">
              <span className="font-['Barlow_Condensed'] font-bold text-xs sm:text-base uppercase tracking-[0.3em] text-vice-pink mb-1">
                PORTFOLIO CLEARED
              </span>
              <h1
                className="font-['Anton'] text-[clamp(34px,11vw,48px)] sm:text-7xl lg:text-8xl tracking-wider text-[#ffc23d] uppercase leading-none skew-btn whitespace-nowrap sm:whitespace-normal"
                style={{ textShadow: '4px 4px 0 #000, 0 0 40px rgba(255,194,61,0.6)' }}
              >
                MISSION PASSED
              </h1>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 lg:gap-6 mt-3 sm:mt-4 font-['Barlow_Condensed'] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2 sm:gap-3 flex-nowrap">
                  <span className="text-white drop-shadow whitespace-nowrap text-[13px] sm:text-base lg:text-2xl">
                    MAX RESPECT
                  </span>
                  <span className="text-vice-pink flex-nowrap whitespace-nowrap text-[16px] sm:text-lg lg:text-2xl">
                    ★ ★ ★ ★ ★
                  </span>
                </div>
                <span className="text-[#5fd068] drop-shadow text-[13px] sm:text-base lg:text-2xl whitespace-nowrap">
                  +$1,000
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
