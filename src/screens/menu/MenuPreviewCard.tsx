import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { MenuItem } from './menuItems';

interface MenuPreviewCardProps {
  selectedItem: MenuItem;
  menuLeaving: boolean;
  isSelectedVisited: boolean;
}

export const MenuPreviewCard: React.FC<MenuPreviewCardProps> = ({
  selectedItem,
  menuLeaving,
  isSelectedVisited,
}) => {
  return (
    <motion.div
      animate={{ opacity: menuLeaving ? 0 : 1 }}
      transition={{ duration: 0.2 }}
      className="ml-10 my-auto shrink-0 z-20 pointer-events-none max-h-full flex flex-col justify-center"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedItem.label}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="rounded-r-xl bg-[rgba(10,10,14,0.76)] backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col select-none shrink-0"
          style={{
            borderLeft: `4px solid ${selectedItem.accent}`,
            width: 'clamp(20rem, 25vw, 32rem)',
            padding: 'clamp(10px, 1.8vh, 20px)',
            gap: 'clamp(6px, 1.2vh, 12px)',
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className="font-['Barlow_Condensed'] font-bold uppercase tracking-[0.2em]"
              style={{
                color: selectedItem.accent,
                fontSize: 'clamp(11px, 1.6vh, 14px)',
              }}
            >
              {selectedItem.badge}
            </span>
            {isSelectedVisited && (
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#5fd068]/15 border border-[#5fd068]/50 text-[#5fd068] font-['Barlow_Condensed'] font-bold uppercase tracking-wider"
                style={{ fontSize: 'clamp(10px, 1.4vh, 12px)' }}
              >
                COMPLETED ✓
              </span>
            )}
          </div>

          <div
            className="relative w-full rounded-[10px] overflow-hidden border shadow-inner shrink-0"
            style={{
              height: 'clamp(110px, 22vh, 190px)',
              borderColor: `${selectedItem.accent}50`,
            }}
          >
            <img
              src={selectedItem.art}
              srcSet={`${selectedItem.art.replace('.webp', '-1280.webp')} 1280w, ${selectedItem.art} 2560w`}
              sizes="(min-width: 1024px) 320px, 90vw"
              alt={selectedItem.label}
              className="w-full h-full object-cover"
              style={{ objectPosition: `${selectedItem.focusX} 0%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>

          <p
            className="font-['Inter'] text-white/90 leading-snug line-clamp-2"
            style={{ fontSize: 'clamp(12px, 1.8vh, 15px)' }}
          >
            "{selectedItem.teaser}"
          </p>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
            <span
              className="font-['Barlow_Condensed'] font-bold uppercase tracking-wider text-[#b9b4ab] shrink-0"
              style={{ fontSize: 'clamp(11px, 1.6vh, 13px)' }}
            >
              INTEL
            </span>
            <span
              className="font-['Barlow_Condensed'] font-bold tracking-wide text-white text-right truncate"
              style={{ fontSize: 'clamp(12px, 1.8vh, 15px)' }}
            >
              {selectedItem.stats}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
