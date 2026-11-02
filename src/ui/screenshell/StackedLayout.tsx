import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { LivingBackground } from '../LivingBackground';
import { StackedAreaName } from '../AreaName';
import { getArtFocus } from '../../data/routes';

interface StackedLayoutProps {
  artSrc: string;
  artAlt: string;
  title: string | [string, string];
  subtitle: string;
  accentColor: string;
  preTitle?: string;
  children: React.ReactNode;
  showNav?: boolean;
  prevRoute: string | null;
  nextRoute: string | null;
  onNav: (route: string) => void;
}

export const StackedLayout: React.FC<StackedLayoutProps> = ({
  artSrc,
  artAlt,
  title,
  subtitle,
  accentColor,
  preTitle,
  children,
  showNav = true,
  prevRoute,
  nextRoute,
  onNav,
}) => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const [stackedScrollY, setStackedScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const stackedScrollRef = useRef<HTMLDivElement | null>(null);

  const artFocus = getArtFocus(artSrc);
  const artKey = artSrc.replace(/^\/?(art\/)?/, '').replace(/\.webp$/, '');

  const handleStackedScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const st = e.currentTarget.scrollTop;
    setStackedScrollY(st);
    setIsScrolled(st > 20);
  };

  const parallaxY = prefersReducedMotion ? 0 : Math.min(180, stackedScrollY * 0.5);
  const parallaxOpacity = prefersReducedMotion
    ? 1
    : Math.max(0.2, 1 - (stackedScrollY / 260) * 0.8);

  const stackedContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.06,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const stackedItemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      exit={{ opacity: 0, y: -16, transition: { duration: 0.25 } }}
      className="lg:hidden flex flex-col h-[100dvh] w-full overflow-hidden pt-[52px] sm:pt-[60px]"
    >
      {/* SINGLE SCROLL CONTAINER */}
      <div
        ref={stackedScrollRef}
        onScroll={handleStackedScroll}
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
        }}
      >
        {/* PARALLAX ART BAND */}
        <div
          className="relative w-full overflow-hidden shrink-0 bg-[#07060a]"
          style={{ height: 'var(--m-art-band)' }}
        >
          <div
            className="w-full h-full relative"
            style={{
              transform: `translate3d(0, ${parallaxY}px, 0)`,
              opacity: parallaxOpacity,
            }}
          >
            <LivingBackground
              stillSrc={artSrc}
              artKey={artKey}
              alt={artAlt}
              focusX={artFocus.focusX}
              focusY="0%"
              isActive={true}
            />

            {/* Bottom fade into opaque #07060a */}
            <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-[#07060a] via-[#07060a]/80 to-transparent pointer-events-none" />

            {/* Area-name popup */}
            <StackedAreaName path={location.pathname} />
          </div>
        </div>

        {/* STICKY TITLE ROW */}
        <div
          className={`sticky top-0 z-20 transition-all duration-200 bg-[#07060a] ${
            isScrolled ? 'border-b border-white/[0.08] shadow-lg' : 'border-b border-transparent'
          }`}
          style={{
            paddingLeft: 'var(--m-gutter)',
            paddingRight: 'var(--m-gutter)',
            paddingTop: '10px',
            paddingBottom: '8px',
          }}
        >
          <div
            className="mx-auto w-full flex flex-col"
            style={{ maxWidth: 'var(--m-content-max)' }}
          >
            {preTitle && (
              <div
                className="font-['Barlow_Condensed'] font-bold uppercase tracking-[0.25em] mb-0.5 select-none"
                style={{ color: accentColor, fontSize: 'var(--m-pretitle)' }}
              >
                {preTitle}
              </div>
            )}

            <div className="relative select-none inline-block self-start">
              <div className="relative inline-block leading-[0.88]">
                {Array.isArray(title) ? (
                  <h1
                    className="font-['Anton'] uppercase tracking-tight text-[#f2efe9]"
                    style={{ fontSize: 'var(--m-title)', textShadow: '0 3px 0 rgba(0,0,0,0.45)', lineHeight: 0.88 }}
                  >
                    <div>{title[0]}</div>
                    <div>{title[1]}</div>
                  </h1>
                ) : (
                  <h1
                    className="font-['Anton'] uppercase tracking-tight text-[#f2efe9]"
                    style={{ fontSize: 'var(--m-title)', textShadow: '0 3px 0 rgba(0,0,0,0.45)', lineHeight: 0.88 }}
                  >
                    {title}
                  </h1>
                )}

                <div
                  className="font-['Yellowtail'] -rotate-4 absolute right-[-0.1em] bottom-[-0.35em] drop-shadow-[0_3px_8px_rgba(0,0,0,0.85)] z-20 pointer-events-none select-none whitespace-nowrap"
                  style={{ color: accentColor, fontSize: 'var(--m-script)' }}
                >
                  {subtitle}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT BODY */}
        <main
          id="main-content"
          tabIndex={-1}
          className="w-full focus:outline-none"
          style={{
            paddingLeft: 'var(--m-gutter)',
            paddingRight: 'var(--m-gutter)',
            paddingTop: '16px',
            paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <motion.div
            variants={stackedContainerVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto w-full flex flex-col"
            style={{ maxWidth: 'var(--m-content-max)', gap: 'var(--m-gap)' }}
          >
            {React.Children.map(children, (child, idx) =>
              React.isValidElement(child) ? (
                <motion.div key={idx} variants={stackedItemVariants}>
                  {child}
                </motion.div>
              ) : (
                child
              )
            )}

            {/* Full-width PREV / NEXT buttons */}
            {showNav && (prevRoute || nextRoute) && (
              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/10 select-none w-full">
                {prevRoute ? (
                  <button
                    type="button"
                    onClick={() => onNav(prevRoute)}
                    style={{ height: 'var(--m-btn-h)', fontSize: 'var(--m-btn-text)' }}
                    className="border border-white/20 bg-black/40 hover:bg-white/10 text-white rounded font-['Barlow_Condensed'] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors "
                  >
                    <ChevronLeft size={16} />
                    PREV
                  </button>
                ) : (
                  <div />
                )}

                {nextRoute ? (
                  <button
                    type="button"
                    onClick={() => onNav(nextRoute)}
                    style={{
                      height: 'var(--m-btn-h)',
                      fontSize: 'var(--m-btn-text)',
                      backgroundColor: accentColor,
                      color: '#000000',
                    }}
                    className="font-['Barlow_Condensed'] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all hover:brightness-110 shadow-lg rounded"
                  >
                    NEXT
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <div />
                )}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
};
