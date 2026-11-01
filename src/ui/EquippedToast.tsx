import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUi } from '../game/GameContext';
import { loadoutProof } from '../data/loadoutProof';

export const EquippedToast: React.FC = () => {
  const { equippedToast } = useUi();

  return (
    <div className="fixed inset-x-0 bottom-16 sm:bottom-20 z-50 flex justify-center pointer-events-none select-none px-4">
      <AnimatePresence>
        {equippedToast && (
          <motion.div
            key={equippedToast.key}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="flex items-center gap-2.5 px-6 py-2.5 rounded bg-black/90 border-2 border-[#38d6ff] shadow-[0_0_30px_rgba(56,214,255,0.45)] backdrop-blur-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#38d6ff] shadow-[0_0_8px_#38d6ff]" />
            <span className="font-['Anton'] text-lg sm:text-2xl uppercase tracking-[0.15em] text-[#38d6ff] leading-none drop-shadow">
              {(loadoutProof[equippedToast.tree]?.short || equippedToast.tree).toUpperCase()} EQUIPPED
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
