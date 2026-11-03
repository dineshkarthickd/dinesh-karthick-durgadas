import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useProgress, useGameActions } from '../game/GameContext';
import { useHotkeys } from '../lib/inputLayer';
import { useIsDesktop } from '../hooks/useMediaQuery';
import { profile } from '../data/portfolio';
import { haptic } from '../lib/feedback';
import { playSelectSound, playMoveSound } from '../lib/sfx';
import { buildMenuItems } from './menu/menuItems';
import { MenuStacked } from './menu/MenuStacked';
import { MenuPreviewCard } from './menu/MenuPreviewCard';

export const Menu: React.FC = () => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const { visited } = useProgress();
  const { toggleLoadout } = useGameActions();

  const MENU_ITEMS = useMemo(() => buildMenuItems(), []);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [transitioningIndex, setTransitioningIndex] = useState<number | null>(null);
  const [menuLeaving, setMenuLeaving] = useState<boolean>(false);

  // Clear any legacy saved index
  useEffect(() => {
    try {
      sessionStorage.removeItem('dk_last_menu_index');
    } catch {
      // ignore
    }
  }, []);

  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear timers on unmount to prevent navigation after unmount
  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const selectedItem = MENU_ITEMS[selectedIndex] || MENU_ITEMS[0];
  const isSelectedVisited = selectedItem.sectionId ? visited.has(selectedItem.sectionId) : false;

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stackedButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelectItem = (index: number) => {
    if (transitioningIndex !== null) return;
    const item = MENU_ITEMS[index];
    if (!item) return;

    setTransitioningIndex(index);
    haptic(10);
    playSelectSound();

    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    if (navTimerRef.current) clearTimeout(navTimerRef.current);

    leaveTimerRef.current = setTimeout(() => {
      setMenuLeaving(true);
    }, 180);

    navTimerRef.current = setTimeout(() => {
      navigate(item.path);
    }, 430);
  };

  const handleHighlight = (index: number) => {
    if (transitioningIndex === null) {
      if (index !== selectedIndex) {
        playMoveSound();
        setSelectedIndex(index);
      }
      buttonRefs.current[index]?.focus();
      stackedButtonRefs.current[index]?.focus();
    }
  };

  useHotkeys('menu', {
    ArrowUp: (e) => {
      e.preventDefault();
      const prev = selectedIndex > 0 ? selectedIndex - 1 : MENU_ITEMS.length - 1;
      handleHighlight(prev);
    },
    ArrowDown: (e) => {
      e.preventDefault();
      const next = selectedIndex < MENU_ITEMS.length - 1 ? selectedIndex + 1 : 0;
      handleHighlight(next);
    },
    Enter: (e) => {
      e.preventDefault();
      handleSelectItem(selectedIndex);
    },
  });

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      className="relative w-full h-full min-h-[100dvh]"
    >
      {isDesktop ? (
        <>
          <div
            className="hidden lg:flex fixed z-10 pointer-events-none"
            style={{
              left: 'var(--frame-x)',
              right: 'var(--frame-x)',
              top: 'max(80px, var(--gutter-y))',
              bottom: 'calc(var(--gutter-y) + 32px)',
            }}
          >
            {/* Left Menu Column */}
            <div
              className="flex flex-col h-full overscroll-contain panel-scroll overflow-y-auto select-none pointer-events-auto pr-3 pl-1"
              style={{
                width: 'clamp(20rem, 24vw, 34rem)',
              }}
            >
              <motion.div
                animate={{
                  x: menuLeaving ? -60 : 0,
                  opacity: menuLeaving ? 0 : 1,
                }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex flex-col my-auto py-1"
              >
                {/* Name & Tagline */}
                <div
                  className="relative inline-block self-start leading-[0.88] shrink-0"
                  style={{ marginBottom: 'clamp(4px, 1vh, 12px)' }}
                >
                  <h1
                    className="font-['Anton'] uppercase tracking-tight text-[#f2efe9]"
                    style={{
                      fontSize: 'clamp(36px, min(7.5vh, 6vw), var(--d-title-max, 100px))',
                      lineHeight: 0.88,
                      textShadow: '0 4px 0 rgba(0,0,0,0.45)',
                    }}
                  >
                    <div>{profile.firstName}</div>
                    <div>{profile.lastName}</div>
                  </h1>
                  <div
                    className="font-['Yellowtail'] text-vice-pink -rotate-4 absolute right-[-0.1em] bottom-[-0.35em] drop-shadow-[0_4px_12px_rgba(255,46,136,0.7)] pointer-events-none whitespace-nowrap"
                    style={{
                      fontSize: 'clamp(22px, min(4.5vh, 3.6vw), var(--d-sub-max, 54px))',
                    }}
                  >
                    Portfolio
                  </div>
                </div>

                <p
                  className="font-['Barlow_Condensed'] font-semibold tracking-[0.2em] text-[#b9b4ab] uppercase -mt-1 shrink-0"
                  style={{
                    fontSize: 'clamp(10px, min(1.6vh, 1.2vw), 14px)',
                    marginBottom: 'clamp(4px, 1vh, 12px)',
                  }}
                >
                  {profile.tagline}
                </p>

                {/* Menu items list */}
                <nav
                  aria-label="Main menu"
                  className="flex flex-col w-full shrink-0"
                  style={{ gap: 'clamp(3px, 0.8vh, 8px)' }}
                >
                  {MENU_ITEMS.map((item, index) => {
                    const isSelected = selectedIndex === index;
                    const isTransitioning = transitioningIndex === index;
                    const isVisited = item.sectionId ? visited.has(item.sectionId) : false;
                    const ItemIcon = item.icon;
                    const barBgColor = isTransitioning ? item.accent : 'var(--color-vice-pink)';

                    return (
                      <button
                        type="button"
                        key={item.label}
                        ref={(el) => {
                          buttonRefs.current[index] = el;
                        }}
                        onFocus={() => {
                          if (selectedIndex !== index) setSelectedIndex(index);
                        }}
                        onMouseEnter={() => handleHighlight(index)}
                        onClick={() => handleSelectItem(index)}
                        className={`group relative flex items-center justify-between rounded text-left transition-colors px-[1rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 min-h-[32px] ${
                          isSelected
                            ? 'text-white'
                            : 'text-[#f2efe9]/80 hover:text-white bg-black/40 border border-white/5'
                        }`}
                        style={{
                          backgroundColor: isSelected ? barBgColor : undefined,
                          boxShadow: isSelected ? `0 0 20px ${barBgColor}60` : undefined,
                          transform: 'skewX(-6deg)',
                          paddingTop: 'clamp(4px, 1.1vh, 10px)',
                          paddingBottom: 'clamp(4px, 1.1vh, 10px)',
                        }}
                      >
                        <div
                          className="flex items-center gap-[0.625rem] min-w-0"
                          style={{ transform: 'skewX(6deg)' }}
                        >
                          <ItemIcon
                            className={`shrink-0 ${
                              isSelected ? 'text-white' : 'text-[#b9b4ab]'
                            }`}
                            style={{
                              width: 'clamp(14px, 2.2vh, 18px)',
                              height: 'clamp(14px, 2.2vh, 18px)',
                              color: isSelected ? '#ffffff' : item.accent,
                            }}
                          />
                          <span
                            className="font-['Barlow_Condensed'] font-bold uppercase tracking-wider truncate leading-none"
                            style={{ fontSize: 'clamp(14px, 2.4vh, 19px)' }}
                          >
                            {item.label}
                          </span>
                        </div>

                        <div
                          className="flex items-center gap-2 shrink-0 ml-2"
                          style={{ transform: 'skewX(6deg)' }}
                        >
                          {isVisited && (
                            <span className="text-[#5fd068] font-bold text-[0.875rem] drop-shadow leading-none">✓</span>
                          )}
                          <span
                            className="font-['Barlow_Condensed'] font-bold opacity-60 group-hover:opacity-100 leading-none"
                            style={{ fontSize: 'clamp(13px, 2vh, 16px)' }}
                          >
                            ›
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                {/* Loadout shortcut hint */}
                <button
                  type="button"
                  onClick={() => {
                    haptic(10);
                    playSelectSound();
                    toggleLoadout();
                  }}
                  className="font-['Barlow_Condensed'] font-bold uppercase tracking-wider text-[#b9b4ab] hover:text-white transition-colors self-start flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38d6ff] shrink-0"
                  style={{
                    fontSize: 'clamp(10px, 1.5vh, 12px)',
                    marginTop: 'clamp(6px, 1.2vh, 12px)',
                  }}
                >
                  <span className="text-[#38d6ff]">Q</span> — LOADOUT
                </button>
              </motion.div>
            </div>

            {/* Section Preview Card in middle */}
            <MenuPreviewCard
              selectedItem={selectedItem}
              menuLeaving={menuLeaving}
              isSelectedVisited={isSelectedVisited}
            />
          </div>

          {/* Desktop Menu Quote */}
          <div
            className="hidden lg:block fixed text-right z-20 pointer-events-none"
            style={{
              bottom: 'var(--gutter-y)',
              right: 'calc(var(--frame-x) + 140px + 24px)',
            }}
          >
            <p className="font-['Inter'] italic text-xs sm:text-sm text-white/60 tracking-wide">
              "{profile.quote}"
            </p>
          </div>
        </>
      ) : (
        <MenuStacked
          items={MENU_ITEMS}
          selectedIndex={selectedIndex}
          transitioningIndex={transitioningIndex}
          visited={visited}
          onHighlight={handleHighlight}
          onSelect={handleSelectItem}
          buttonRefs={stackedButtonRefs}
        />
      )}
    </motion.div>
  );
};
