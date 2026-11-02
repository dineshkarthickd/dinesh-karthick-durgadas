import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGameActions, type SectionId, ALL_SECTIONS } from '../game/GameContext';
import { getPrevNextRoutes, getRouteByPath, ROUTE_SEQUENCE } from '../data/routes';
import { useHotkeys } from '../lib/inputLayer';
import { useIsDesktop } from '../hooks/useMediaQuery';
import { haptic } from '../lib/feedback';
import { playBackSound, playSelectSound } from '../lib/sfx';
import { StackedLayout } from './screenshell/StackedLayout';

export interface ScreenShellProps {
  artSrc: string;
  artAlt: string;
  title: string | [string, string];
  subtitle: string;
  accentColor: string;
  sectionId?: SectionId;
  preTitle?: string;
  children: React.ReactNode;
  showNav?: boolean;
  fillHeight?: boolean;
}

export const ScreenShell: React.FC<ScreenShellProps> = ({
  artSrc,
  artAlt,
  title,
  subtitle,
  accentColor,
  sectionId,
  preTitle,
  children,
  showNav = true,
  fillHeight = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { markVisited, toggleLoadout } = useGameActions();
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  const desktopPanelRef = useRef<HTMLDivElement | null>(null);

  // Reset scroll to top on screen open
  useEffect(() => {
    if (desktopPanelRef.current) {
      desktopPanelRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  // Mark section as visited if it's one of the canonical sections
  useEffect(() => {
    if (sectionId && (ALL_SECTIONS as readonly string[]).includes(sectionId)) {
      markVisited(sectionId);
    }
  }, [sectionId, markVisited]);

  // Preload adjacent artworks
  useEffect(() => {
    const currentIndex = ROUTE_SEQUENCE.indexOf(location.pathname);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % ROUTE_SEQUENCE.length;
      const prevIndex = (currentIndex - 1 + ROUTE_SEQUENCE.length) % ROUTE_SEQUENCE.length;

      const nextRoute = getRouteByPath(ROUTE_SEQUENCE[nextIndex]);
      const prevRoute = getRouteByPath(ROUTE_SEQUENCE[prevIndex]);

      if (nextRoute) {
        const preloadNext = new Image();
        preloadNext.src = isDesktop ? nextRoute.stillSrc : nextRoute.stillSrc.replace(/\.webp$/, '-1280.webp');
      }
      if (prevRoute) {
        const preloadPrev = new Image();
        preloadPrev.src = isDesktop ? prevRoute.stillSrc : prevRoute.stillSrc.replace(/\.webp$/, '-1280.webp');
      }
    }
  }, [location.pathname, isDesktop]);

  const { prevRoute, nextRoute } = getPrevNextRoutes(location.pathname);

  const handleNav = (targetRoute: string) => {
    haptic(10);
    playSelectSound();
    navigate(targetRoute);
  };

  // Keyboard navigation
  useHotkeys('page', {
    Escape: (e) => {
      if (location.pathname !== '/') {
        e.preventDefault();
        haptic(10);
        playBackSound();
        navigate('/');
      }
    },
    ArrowLeft: (e) => {
      if (prevRoute) {
        e.preventDefault();
        handleNav(prevRoute);
      }
    },
    ArrowRight: (e) => {
      if (nextRoute) {
        e.preventDefault();
        handleNav(nextRoute);
      }
    },
  });

  const desktopContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.04,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  };

  const desktopItemVariants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -16 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="relative w-full h-full min-h-[100dvh]"
    >
      {isDesktop ? (
        <div className="hidden lg:block absolute inset-0 overflow-hidden">
          {/* Desktop Left Content Panel */}
          <motion.div
            ref={desktopPanelRef}
            exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
            className={`absolute overscroll-contain z-10 flex flex-col ${
              fillHeight ? 'overflow-hidden' : 'panel-scroll overflow-y-auto'
            }`}
            style={{
              left: 'var(--frame-x)',
              top: 'max(calc(56px + 24px), var(--gutter-y))',
              bottom: 'calc(var(--gutter-y) + 48px)',
              width: 'min(34vw, 540px)',
            }}
          >
            <motion.div
              variants={desktopContainerVariants}
              initial="hidden"
              animate="visible"
              className={`py-2 flex flex-col ${fillHeight ? 'h-full min-h-0' : 'my-auto'}`}
              style={{ gap: 'clamp(6px, 1.1vh, 12px)' }}
            >
              {/* Title Block */}
              <motion.div
                variants={desktopItemVariants}
                className="shrink-0 flex flex-col mb-2.5 select-none inline-block self-start"
              >
                {preTitle && (
                  <div
                    className="font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-[0.25em] mb-1 select-none"
                    style={{ color: accentColor }}
                  >
                    {preTitle}
                  </div>
                )}

                <div className="relative inline-block leading-[0.88]">
                  {Array.isArray(title) ? (
                    <h1
                      className="font-['Anton'] uppercase text-[clamp(44px,7.5vh,84px)] tracking-tight text-[#f2efe9]"
                      style={{ textShadow: '0 4px 0 rgba(0,0,0,0.45)', lineHeight: 0.88 }}
                    >
                      <div>{title[0]}</div>
                      <div>{title[1]}</div>
                    </h1>
                  ) : (
                    <h1
                      className="font-['Anton'] uppercase text-[clamp(44px,7.5vh,84px)] tracking-tight text-[#f2efe9]"
                      style={{ textShadow: '0 4px 0 rgba(0,0,0,0.45)', lineHeight: 0.88 }}
                    >
                      {title}
                    </h1>
                  )}

                  <div
                    className="font-['Yellowtail'] text-[clamp(22px,3.8vh,40px)] -rotate-4 absolute right-[-0.1em] bottom-[-0.35em] drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)] z-20 pointer-events-none select-none whitespace-nowrap"
                    style={{ color: accentColor }}
                  >
                    {subtitle}
                  </div>
                </div>
              </motion.div>

              {/* Direct children */}
              {React.Children.map(children, (child, idx) =>
                React.isValidElement(child) ? (
                  <motion.div
                    key={idx}
                    variants={desktopItemVariants}
                    className={fillHeight ? 'flex-1 min-h-0 flex flex-col' : undefined}
                  >
                    {child}
                  </motion.div>
                ) : (
                  child
                )
              )}
            </motion.div>
          </motion.div>

          {/* Desktop Fixed PREV / NEXT & Shortcuts row */}
          {showNav && (
            <div
              className="fixed flex items-center justify-between z-20 select-none"
              style={{
                bottom: 'var(--gutter-y)',
                left: 'var(--frame-x)',
                width: 'min(34vw, 540px)',
              }}
            >
              <div className="flex items-center gap-4">
                {prevRoute && (
                  <button
                    type="button"
                    onClick={() => handleNav(prevRoute)}
                    className="flex items-center gap-1 font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider text-[#b9b4ab] hover:text-white transition-colors group"
                  >
                    <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                    PREV
                  </button>
                )}

                {nextRoute && (
                  <button
                    type="button"
                    onClick={() => handleNav(nextRoute)}
                    className="flex items-center gap-1 font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider text-[#b9b4ab] hover:text-white transition-colors group"
                  >
                    NEXT
                    <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 font-['Barlow_Condensed'] font-bold text-[11px] uppercase tracking-wider text-[#b9b4ab]">
                <button
                  type="button"
                  onClick={() => {
                    haptic(10);
                    playBackSound();
                    navigate('/');
                  }}
                  className="hover:text-white transition-colors "
                >
                  <span className="text-vice-pink">ESC</span> — MENU
                </button>
                <button
                  type="button"
                  onClick={() => {
                    haptic(10);
                    playSelectSound();
                    toggleLoadout();
                  }}
                  className="hover:text-white transition-colors "
                >
                  <span className="text-[#38d6ff]">Q</span> — LOADOUT
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <StackedLayout
          artSrc={artSrc}
          artAlt={artAlt}
          title={title}
          subtitle={subtitle}
          accentColor={accentColor}
          preTitle={preTitle}
          showNav={showNav}
          prevRoute={prevRoute}
          nextRoute={nextRoute}
          onNav={handleNav}
        >
          {children}
        </StackedLayout>
      )}
    </motion.div>
  );
};
