import React from 'react';
import { motion } from 'motion/react';
import { LivingBackground } from '../../ui/LivingBackground';
import { profile } from '../../data/portfolio';
import type { MenuItem } from './menuItems';

interface MenuStackedProps {
  items: MenuItem[];
  selectedIndex: number;
  transitioningIndex: number | null;
  visited: Set<string>;
  onHighlight: (index: number) => void;
  onSelect: (index: number) => void;
  buttonRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

export const MenuStacked: React.FC<MenuStackedProps> = ({
  items,
  selectedIndex,
  transitioningIndex,
  visited,
  onHighlight,
  onSelect,
  buttonRefs,
}) => {
  return (
    <motion.div
      exit={{ opacity: 0, y: -16, transition: { duration: 0.25 } }}
      className="lg:hidden flex flex-col h-[100dvh] w-full overflow-hidden pt-[52px] sm:pt-[60px] bg-[#07060a]"
    >
      {/* Top Art Band */}
      <div
        className="relative w-full shrink-0 overflow-hidden bg-[#07060a]"
        style={{ height: 'var(--m-art-band)' }}
      >
        <LivingBackground
          stillSrc="/art/menu.webp"
          artKey="menu"
          alt="Illustration of Dinesh Karthick"
          focusX="76%"
          focusY="0%"
          isActive={true}
        />

        {/* Bottom gradient fade into solid opaque #07060a */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#07060a] via-[#07060a]/85 to-transparent pointer-events-none" />

        {/* Name & tagline overlapping bottom of art band */}
        <div
          className="absolute bottom-2 left-0 right-0 z-10 flex flex-col"
          style={{
            paddingLeft: 'var(--m-gutter)',
            paddingRight: 'var(--m-gutter)',
          }}
        >
          <div
            className="mx-auto w-full flex flex-col"
            style={{ maxWidth: 'var(--m-content-max)' }}
          >
            <div className="relative inline-block self-start leading-[0.88]">
              <h1
                className="font-['Anton'] uppercase tracking-tight text-[#f2efe9]"
                style={{
                  fontSize: 'var(--m-title)',
                  textShadow: '0 3px 0 rgba(0,0,0,0.5)',
                  lineHeight: 0.88,
                }}
              >
                <div>{profile.firstName}</div>
                <div>{profile.lastName}</div>
              </h1>
              <div
                className="font-['Yellowtail'] text-[#ff2e88] -rotate-4 absolute right-[-0.1em] bottom-[-0.35em] drop-shadow-[0_4px_10px_rgba(255,46,136,0.6)] pointer-events-none whitespace-nowrap"
                style={{ fontSize: 'var(--m-script)' }}
              >
                Portfolio
              </div>
            </div>

            <p className="font-['Barlow_Condensed'] font-semibold text-[11px] sm:text-xs tracking-[0.2em] text-[#b9b4ab] uppercase mt-1">
              {profile.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Solid opaque #07060a Menu List underneath (native touch scrolling, min-h-0 flex-1) */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain bg-[#07060a] relative z-10"
        style={{
          paddingLeft: 'var(--m-gutter)',
          paddingRight: 'var(--m-gutter)',
          paddingTop: '6px',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
          scrollbarWidth: 'thin',
          scrollbarColor: '#ff2e88 transparent',
        }}
      >
        <nav
          aria-label="Stacked main menu"
          className="mx-auto w-full flex flex-col divide-y divide-white/[0.08]"
          style={{ maxWidth: 'var(--m-content-max)' }}
        >
          {items.map((item, index) => {
            const isSelected = selectedIndex === index;
            const isTransitioning = transitioningIndex === index;
            const isVisited = item.sectionId ? visited.has(item.sectionId) : false;
            const ItemIcon = item.icon;
            const barBgColor = isTransitioning ? item.accent : '#ff2e88';

            return (
              <button
                type="button"
                key={item.label}
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                onFocus={() => {
                  if (selectedIndex !== index) onHighlight(index);
                }}
                onMouseEnter={() => onHighlight(index)}
                onClick={() => onSelect(index)}
                className={`group flex items-center justify-between px-3 transition-colors cursor-pointer h-[44px] text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                  isSelected ? 'text-white' : 'text-white/90 active:bg-white/5'
                }`}
                style={{
                  backgroundColor: isSelected ? barBgColor : undefined,
                  transition: 'background-color 150ms ease',
                }}
              >
                {/* Left: Section Icon Tile + Label */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded flex items-center justify-center shrink-0 shadow-sm ${
                      isSelected ? 'bg-black text-[#ff2e88]' : 'bg-[#0a0a0e] border'
                    }`}
                    style={{ borderColor: isSelected ? undefined : item.accent }}
                  >
                    <ItemIcon
                      size={16}
                      className={isSelected ? 'text-[#ff2e88]' : undefined}
                      style={{ color: isSelected ? undefined : item.accent }}
                    />
                  </div>

                  <span className="font-['Barlow_Condensed'] font-bold text-[15px] sm:text-[17px] tracking-wider uppercase truncate">
                    {item.label}
                  </span>
                </div>

                {/* Right: Checkmark if visited + Chevron */}
                <div className="flex items-center gap-2 shrink-0">
                  {isVisited && (
                    <span className="text-[#5fd068] font-black text-sm drop-shadow">✓</span>
                  )}
                  <span className="font-['Barlow_Condensed'] font-black text-lg sm:text-xl leading-none">
                    ›
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
};
