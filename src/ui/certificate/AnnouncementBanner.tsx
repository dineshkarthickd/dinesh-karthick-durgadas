import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Tier } from '../../data/portfolio';
import { TIER_META } from '../../data/tiers';
import { playMissionPassedSound, playSelectSound } from '../../lib/sfx';
import { haptic } from '../../lib/feedback';

interface AnnouncementBannerProps {
  tier: Tier;
  prefersReduced: boolean;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  tier,
  prefersReduced,
}) => {
  const [announcing, setAnnouncing] = useState<boolean>(() => !prefersReduced);
  const tierStyle = TIER_META[tier] || TIER_META.bronze;

  useEffect(() => {
    if (prefersReduced) return;

    if (tier === 'gold') {
      playMissionPassedSound();
    } else {
      playSelectSound();
    }
    haptic([20, 40, 20]);

    const timer = setTimeout(() => {
      setAnnouncing(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [tier, prefersReduced]);

  return (
    <AnimatePresence>
      {announcing && (
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '0%', opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{
            duration: prefersReduced ? 0.2 : 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed top-[22%] left-0 right-0 z-[105] pointer-events-none flex flex-col items-center justify-center py-4 bg-gradient-to-r from-transparent via-black/85 to-transparent border-y-2 border-white/20"
        >
          <div
            className="font-['Anton'] text-4xl sm:text-6xl tracking-wider uppercase leading-none"
            style={{
              color: tierStyle.color,
              WebkitTextStroke: '2px black',
              paintOrder: 'stroke fill',
              textShadow: `0 0 24px ${tierStyle.glow}, 0 4px 10px rgba(0,0,0,0.9)`,
            }}
          >
            {tierStyle.label}
          </div>
          <div
            className="font-['Yellowtail'] text-2xl sm:text-4xl text-white -mt-2 -rotate-3"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}
          >
            Unlocked
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
