import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import { useProgress } from '../game/GameContext';

interface MoneyProps {
  className?: string;
  amountClassName?: string;
  showDelta?: boolean;
}

export const Money: React.FC<MoneyProps> = ({
  className = 'relative flex items-center justify-end gap-2',
  amountClassName = "font-['Barlow_Condensed'] font-bold text-[#5fd068] text-[24px] sm:text-[30px] tracking-wider leading-none",
  showDelta = true,
}) => {
  const { xp, xpDelta } = useProgress();
  const [activeDelta, setActiveDelta] = useState<{ amount: number; id: number } | null>(null);
  const [displayValue, setDisplayValue] = useState<number>(xp);
  const prevXpRef = useRef<number>(xp);

  // Animated money roll-up
  useEffect(() => {
    const from = prevXpRef.current;
    const to = xp;
    prevXpRef.current = to;

    if (from === to) return;

    const controls = animate(from, to, {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [xp]);

  useEffect(() => {
    if (xpDelta) {
      const showTimer = setTimeout(() => {
        setActiveDelta({ amount: xpDelta.amount, id: xpDelta.key });
      }, 0);
      const hideTimer = setTimeout(() => {
        setActiveDelta(null);
      }, 1200);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [xpDelta]);

  return (
    <div className={className}>
      {showDelta && (
        <AnimatePresence>
          {activeDelta && (
            <motion.div
              key={activeDelta.id}
              initial={{ opacity: 0, x: 8, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -8, scale: 0.85 }}
              transition={{ duration: 0.25 }}
              className="font-['Barlow_Condensed'] font-bold text-[#5fd068] text-sm tracking-wide shrink-0"
              style={{ textShadow: '0 0 10px rgba(95,208,104,0.6)' }}
            >
              +${activeDelta.amount}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <div className={amountClassName} style={{ textShadow: '2px 2px 0 #000, 0 0 10px rgba(0,0,0,0.8)' }}>
        ${displayValue.toLocaleString()}
      </div>
    </div>
  );
};
