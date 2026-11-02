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
            className="hidden lg:flex fixed inset-0 z-10 pointer-events-none items-center"
            style={{
              paddingLeft: 'var(--frame-x)',
              paddingRight: 'var(--frame-x)',
              paddingTop: 'var(--gutter-y)',
              paddingBottom: 'var(--gutter-y)',
            }}
          >
            {/* Left Menu Column */}
            <motion.div
              animate={{
                x: menuLeaving ? -60 : 0,
                opacity: menuLeaving ? 0 : 1,
              }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex flex-col justify-center select-none pointer-events-auto"
              style={{
                width: 'clamp(280px, 22vw, 380px)',
              }}
            >
              {/* Name & Tagline */}
              <div className="relative inline-block self-start mb-4 leading-[0.88]">
                <h1
                  className="font-['Anton'] uppercase text-[clamp(44px,7.5vh,84px)] tracking-tight text-[#f2efe9]"
                  style={{ textShadow: '0 4px 0 rgba(0,0,0,0.45)', lineHeight: 0.88 }}
                >
                  <div>{profile.firstName}</div>
                  <div>{profile.lastName}</div>
                </h1>
                <div className="font-['Yellowtail'] text-vice-pink text-[clamp(28px,4.5vh,48px)] -rotate-4 absolute right-[-0.1em] bottom-[-0.35em] drop-shadow-[0_4px_12px_rgba(255,46,136,0.7)] pointer-events-none whitespace-nowrap">
                  Portfolio
                </div>
              </div>

              <p className="font-['Barlow_Condensed'] font-semibold text-xs tracking-[0.2em] text-[#b9b4ab] uppercase -mt-1 mb-4">
                {profile.tagline}
              </p>

              {/* Menu items list */}
              <nav aria-label="Main menu" className="flex flex-col gap-1.5 w-full">
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
                      className={`group relative flex items-center justify-between px-3 py-2 rounded text-left transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                        isSelected
                          ? 'text-white'
                          : 'text-[#f2efe9]/80 hover:text-white bg-black/40 border border-white/5'
                      }`}
                      style={{
                        backgroundColor: isSelected ? barBgColor : undefined,
                        boxShadow: isSelected ? `0 0 20px ${barBgColor}60` : undefined,
                        transform: 'skewX(-6deg)',
                      }}
                    >
                      <div
                        className="flex items-center gap-2.5 min-w-0"
                        style={{ transform: 'skewX(6deg)' }}
                      >
                        <ItemIcon
                          size={16}
                          className={isSelected ? 'text-white' : 'text-[#b9b4ab]'}
                          style={{ color: isSelected ? '#ffffff' : item.accent }}
                        />
                        <span className="font-['Barlow_Condensed'] font-bold text-lg uppercase tracking-wider truncate">
                          {item.label}
                        </span>
                      </div>

                      <div
                        className="flex items-center gap-2 shrink-0 ml-2"
                        style={{ transform: 'skewX(6deg)' }}
                      >
                        {isVisited && (
                          <span className="text-[#5fd068] font-bold text-xs drop-shadow">✓</span>
                        )}
                        <span className="font-['Barlow_Condensed'] font-bold text-sm opacity-60 group-hover:opacity-100">
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
                className="font-['Barlow_Condensed'] font-bold text-[11px] uppercase tracking-wider text-[#b9b4ab] hover:text-white transition-colors cursor-pointer mt-3 self-start flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38d6ff]"
              >
                <span className="text-[#38d6ff]">Q</span> — LOADOUT
              </button>
            </motion.div>

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
