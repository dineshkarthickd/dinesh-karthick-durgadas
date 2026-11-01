import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { useProgress } from '../game/GameContext';

interface StarsProps {
  size?: number;
  gap?: string;
}

export const Stars: React.FC<StarsProps> = ({ size = 18, gap = 'gap-1.5' }) => {
  const { stars } = useProgress();
  const prevStarsRef = useRef(stars);
  const [poppingIndex, setPoppingIndex] = useState<number | null>(null);

  useEffect(() => {
    const prev = prevStarsRef.current;
    prevStarsRef.current = stars;

    if (stars > prev) {
      const popTimer = setTimeout(() => {
        setPoppingIndex(stars - 1);
      }, 0);
      const clearTimer = setTimeout(() => {
        setPoppingIndex(null);
      }, 1000);
      return () => {
        clearTimeout(popTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [stars]);

  return (
    <div className={`flex items-center ${gap}`}>
      {[0, 1, 2, 3, 4].map((index) => {
        const isFilled = index < stars;
        const isPopping = index === poppingIndex;

        return (
          <motion.div
            key={index}
            animate={
              isPopping
                ? {
                    scale: [1, 1.6, 1],
                    filter: [
                      'drop-shadow(0 0 0px #ffc23d)',
                      'drop-shadow(0 0 12px #fff)',
                      'drop-shadow(0 0 4px #ffc23d)',
                    ],
                  }
                : { scale: 1 }
            }
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Star
              size={size}
              className={`transition-colors duration-300 ${
                isFilled
                  ? 'fill-[#ffc23d] text-[#ffc23d] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
                  : 'fill-transparent text-white/50 stroke-[1.5]'
              }`}
            />
          </motion.div>
        );
      })}
    </div>
  );
};
