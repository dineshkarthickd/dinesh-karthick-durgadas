import React from 'react';
import { motion } from 'motion/react';

interface MinimapProps {
  accentColor: string;
}

export const Minimap: React.FC<MinimapProps> = ({ accentColor }) => {
  return (
    <div className="relative w-[104px] h-[104px] rounded-xl overflow-hidden border-2 border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.8)] bg-[#12131a] select-none">
      {/* Ocean / water zone */}
      <div className="absolute inset-y-0 right-0 w-[42px] bg-[#1a3852]/60 border-l border-[#38d6ff]/20" />

      {/* Grid road network */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Diagonal highway */}
      <div className="absolute w-[180px] h-[3px] bg-white/25 top-1/2 left-[-20px] -rotate-45" />
      <div className="absolute w-[140px] h-[2px] bg-white/15 top-1/4 left-0 rotate-12" />

      {/* Compass markers */}
      <div className="absolute top-1 left-2 font-['Barlow_Condensed'] font-bold text-[9px] text-white/50 tracking-wider">
        N
      </div>
      <div className="absolute bottom-1 right-2 font-['Barlow_Condensed'] font-bold text-[9px] text-[#38d6ff]/60 tracking-wider">
        OCEAN
      </div>

      {/* Pulsing Mission / Current Location Blip */}
      <div className="absolute top-[38px] left-[42px]">
        <motion.div
          animate={{ scale: [1, 2.2, 1], opacity: [0.9, 0, 0.9] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -inset-1 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="relative w-2.5 h-2.5 rounded-full border border-black shadow-[0_0_8px]"
          style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
        />
      </div>

      {/* Player white navigation arrow in center rotating slowly */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 flex items-center justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white stroke-black stroke-1">
            <polygon points="12,2 22,21 12,17 2,21" />
          </svg>
        </motion.div>
      </div>

      {/* Subtle scanline / radar sweep */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[-50%] origin-center pointer-events-none opacity-20"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.4) 30deg, transparent 35deg)',
        }}
      />
    </div>
  );
};
