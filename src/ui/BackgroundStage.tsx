import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { LivingBackground } from './LivingBackground';
import { getRouteByPath, ROUTES } from '../data/routes';
import { useIsDesktop } from '../hooks/useMediaQuery';

export const BackgroundStage: React.FC = () => {
  const isDesktop = useIsDesktop();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const route = getRouteByPath(location.pathname) || ROUTES[0];

  if (!isDesktop) return null;

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none z-0 select-none overflow-hidden">
      {/* Artwork Layer: Single AnimatePresence keyed by artKey ensures outgoing layer is not remounted */}
      <AnimatePresence>
        <motion.div
          key={route.artKey}
          initial={{
            opacity: 0,
            scale: shouldReduceMotion ? 1 : 1.03,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
          }}
          transition={{
            opacity: {
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            },
            scale: {
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          className="absolute inset-0"
        >
          <LivingBackground
            stillSrc={route.stillSrc}
            artKey={route.artKey}
            alt={route.alt}
            focusX={route.focus.x}
            focusY={route.focus.y}
            isActive={true}
          />
        </motion.div>
      </AnimatePresence>

      {/* Stage Overlays (Persist above artwork across all route transitions) */}
      <div className="absolute inset-0 left-gradient-overlay" />
      <div className="absolute inset-0 top-shade pointer-events-none" />
      <div className="vignette" />
      <div className="film-grain" />
    </div>
  );
};
