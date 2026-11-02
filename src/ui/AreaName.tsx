import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { getRouteByPath } from '../data/routes';

/**
 * Global desktop area name popup (bottom: var(--gutter-y), centered).
 * Hidden on mobile/tablets since stacked layout renders the area name inside the art band.
 */
export const AreaName: React.FC = () => {
  const location = useLocation();
  const route = getRouteByPath(location.pathname);
  const info = route?.area;

  if (!info) return null;

  return (
    <div
      className="hidden lg:block fixed z-30 pointer-events-none select-none text-left"
      style={{
        bottom: 'calc(var(--gutter-y) + 40px)',
        left: 'calc(var(--frame-x) + min(34vw, 540px) + 32px)',
        maxWidth: 'calc(100vw - (var(--frame-x) + min(34vw, 540px) + 32px) - 170px)',
      }}
    >
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 25 }}
        animate={{
          opacity: [0, 1, 1, 0],
          y: [25, 0, 0, -15],
        }}
        transition={{
          duration: 3,
          times: [0, 0.15, 0.82, 1],
          ease: 'easeOut',
        }}
        className="flex flex-col items-start"
      >
        <h2
          className="font-['Anton'] italic text-[clamp(24px,2.4vw,40px)] tracking-wider text-white uppercase leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] whitespace-nowrap pr-[0.2em]"
          style={{ textShadow: '2px 2px 0 #000, 0 0 20px rgba(0,0,0,0.8)' }}
        >
          {info.name}
        </h2>
        {info.district && (
          <span className="font-['Barlow_Condensed'] font-bold text-sm tracking-[0.25em] text-[#b9b4ab] uppercase mt-1 drop-shadow-md pr-[0.15em]">
            · {info.district} ·
          </span>
        )}
      </motion.div>
    </div>
  );
};

/**
 * Area name popup for stacked layout art band:
 * Sits at bottom-left of the band (left: var(--gutter-x); bottom: 12px), size 24px (phones) / 30px (tablets).
 */
export const StackedAreaName: React.FC<{ path: string }> = ({ path }) => {
  const route = getRouteByPath(path);
  const info = route?.area;

  if (!info || path === '/') return null;

  return (
    <div
      className="lg:hidden absolute z-10 pointer-events-none select-none text-left"
      style={{
        left: 'var(--m-gutter)',
        bottom: '12px',
      }}
    >
      <motion.div
        key={path}
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: [0, 1, 1, 0],
          y: [15, 0, 0, -10],
        }}
        transition={{
          duration: 3,
          times: [0, 0.15, 0.82, 1],
          ease: 'easeOut',
        }}
        className="flex flex-col"
      >
        <h2
          className="font-['Anton'] italic text-[24px] sm:text-[30px] tracking-wider text-white uppercase leading-none drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] whitespace-nowrap pr-[0.2em] stacked-area-title"
          style={{ textShadow: '2px 2px 0 #000' }}
        >
          {info.name}
        </h2>
        {info.district && (
          <span className="font-['Barlow_Condensed'] font-bold text-[11px] sm:text-[13px] tracking-[0.2em] text-[#b9b4ab] uppercase mt-0.5 drop-shadow-md pr-[0.15em] stacked-area-subtitle">
            · {info.district} ·
          </span>
        )}
      </motion.div>
    </div>
  );
};
