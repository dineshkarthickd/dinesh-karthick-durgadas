import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Gamepad2,
  Crosshair,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Clock } from './Clock';
import { Money } from './Money';
import { Stars } from './Stars';
import { Radio } from './Radio';
import { Countdown } from './Countdown';
import { Minimap } from './Minimap';
import { ArmorBar } from './ArmorBar';
import { useProgress, useUi, useGameActions } from '../game/GameContext';
import { useIsDesktop } from '../hooks/useMediaQuery';
import { loadoutProof } from '../data/loadoutProof';
import { ICON_MAP } from '../data/icons';
import { ROUTES, getRouteByPath, TOTAL_SECTIONS } from '../data/routes';
import { haptic } from '../lib/feedback';
import {
  isSfxEnabled,
  toggleSfx,
  subscribeSfx,
  playBackSound,
  playSelectSound,
} from '../lib/sfx';

export const Hud: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const { visited } = useProgress();
  const { equipped } = useUi();
  const { toggleLoadout, unequipTree } = useGameActions();

  const currentPath = location.pathname;
  const current = getRouteByPath(currentPath) || ROUTES[0];
  const isMenu = currentPath === '/';

  // SFX state subscription
  const [sfxOn, setSfxOn] = useState<boolean>(isSfxEnabled());
  useEffect(() => {
    return subscribeSfx(setSfxOn);
  }, []);

  // First-visit Loadout tooltip and pulse on mobile (initialized lazily to avoid setState in effect)
  const [showLoadoutTooltip, setShowLoadoutTooltip] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('dk_loadout_hint_seen');
    } catch {
      return false;
    }
  });
  const [pulseLoadout, setPulseLoadout] = useState<boolean>(() => showLoadoutTooltip);

  useEffect(() => {
    if (showLoadoutTooltip) {
      try {
        sessionStorage.setItem('dk_loadout_hint_seen', 'true');
      } catch {
        // ignore
      }
      const timer = setTimeout(() => {
        setShowLoadoutTooltip(false);
        setPulseLoadout(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showLoadoutTooltip]);

  const healthPercent = Math.min(100, Math.round((visited.size / TOTAL_SECTIONS) * 100));

  const handleBackToMenu = () => {
    haptic(10);
    playBackSound();
    navigate('/');
  };

  const handleOpenLoadout = () => {
    haptic(10);
    playSelectSound();
    setShowLoadoutTooltip(false);
    toggleLoadout();
  };

  const handleToggleSfx = () => {
    haptic(10);
    toggleSfx();
  };

  return isDesktop ? (
    /* =========================================================================
        DESKTOP HUD (lg: landscape >= 1024px)
        One slim HUD strip hugging the very top edge of the screen:
        top: 20px, left: 28px, right: 28px, height <= 44px
        Left: Radio pill + SFX toggle
        Centre: Countdown on ONE line
        Right: Clock (22px) · Money (22px) · Stars (14px) + 3px thin bar underneath
        Minimap: bottom: 24px, right: 28px
       ========================================================================= */
    <div className="hidden lg:block fixed inset-0 pointer-events-none z-30 select-none overflow-hidden">
      {/* Top Slim HUD Strip */}
      <div
        className="absolute flex items-center justify-between"
        style={{
          top: '20px',
          left: '28px',
          right: '28px',
          height: '44px',
        }}
      >
        {/* Left: Radio pill + SFX toggle */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <Radio />
          {/* SFX Toggle next to Radio */}
          <button
            type="button"
            onClick={handleToggleSfx}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-['Barlow_Condensed'] font-bold uppercase tracking-wider border backdrop-blur-md transition-colors cursor-pointer ${
              sfxOn
                ? 'bg-black/60 border-white/20 text-[#5fd068] hover:border-[#5fd068]'
                : 'bg-black/60 border-white/20 text-[#b9b4ab] hover:text-white'
            }`}
            title="Toggle game sound effects"
          >
            {sfxOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{sfxOn ? 'SFX ON' : 'SFX OFF'}</span>
          </button>
        </div>

        {/* Centre: Countdown on ONE line */}
        <div className="pointer-events-auto">
          <Countdown />
        </div>

        {/* Right, one row: Clock (22px) · Money (22px) · Stars (14px, gap 4px) + 3px bar underneath */}
        <div className="flex flex-col items-end pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <Clock className="font-['Barlow_Condensed'] font-bold text-white text-[22px] tracking-wide leading-none" />
            <span className="text-white/30 text-xs">·</span>
            <Money
              showDelta={false}
              className="flex items-center"
              amountClassName="font-['Barlow_Condensed'] font-bold text-[#5fd068] text-[22px] tracking-wide leading-none"
            />
            <span className="text-white/30 text-xs">·</span>
            <Stars size={14} gap="gap-1" />
            {equipped ? (
              <div className="flex items-center gap-1.5 ml-1 px-2 py-0.5 rounded bg-[#38d6ff]/15 border border-[#38d6ff]/40 text-[#38d6ff] font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider backdrop-blur-sm">
                <button
                  type="button"
                  onClick={handleOpenLoadout}
                  className="flex items-center gap-1 hover:text-white cursor-pointer"
                  title="Change equipped skill tree"
                >
                  <Crosshair size={12} />
                  <span>{loadoutProof[equipped]?.short || equipped}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    haptic(10);
                    unequipTree();
                  }}
                  aria-label="Unequip skill tree"
                  className="hover:text-white px-0.5 cursor-pointer leading-none font-bold"
                  title="Unequip"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleOpenLoadout}
                className="flex items-center gap-1 ml-1 px-2 py-0.5 rounded bg-white/5 border border-white/20 text-[#b9b4ab] hover:text-white hover:border-[#ff2e88] font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider backdrop-blur-sm cursor-pointer transition-colors"
                title="Open Tech Stack Loadout (TAB)"
              >
                <Crosshair size={12} />
                <span>LOADOUT</span>
              </button>
            )}
          </div>

          {/* Health/armor thin bar (3px tall) under this row */}
          <div className="w-full h-[3px] bg-black/60 rounded-xs border border-white/20 p-[0.5px] flex gap-1 mt-1 shadow-inner overflow-hidden">
            <div className="flex-1 h-full bg-neutral-900 rounded-2xs overflow-hidden">
              <div
                className="h-full bg-[#5fd068] transition-all duration-500"
                style={{ width: `${healthPercent}%` }}
                title={`Exploration: ${visited.size}/${TOTAL_SECTIONS} sections`}
              />
            </div>
            <ArmorBar />
          </div>
        </div>
      </div>

      {/* Bottom-Right: Minimap at right: 28px; bottom: 24px */}
      <div
        className="absolute pointer-events-auto"
        style={{
          bottom: '24px',
          right: '28px',
        }}
      >
        <Minimap accentColor={current.accent} />
      </div>
    </div>
  ) : (
    /* =========================================================================
        MOBILE & TABLET STACKED HUD HEADER
        Solid bar fixed at top (height: 52px on phones, 60px on tablets)
       ========================================================================= */
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#07060a]/92 backdrop-blur-md border-b border-white/10 select-none shadow-lg">
      <div className="h-[52px] sm:h-[60px] px-3 sm:px-4 flex items-center justify-between gap-2 max-w-full">
        {/* Left: Back-to-Menu button or Menu indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!isMenu ? (
            <button
              type="button"
              onClick={handleBackToMenu}
              className="flex items-center gap-1.5 py-1 px-2 -ml-1 rounded border border-white/10 bg-black/40 text-[#b9b4ab] hover:text-white hover:border-[#ff2e88] transition-colors cursor-pointer text-xs font-['Barlow_Condensed'] font-bold uppercase tracking-wider"
              title="Return to Main Menu"
            >
              <Gamepad2 size={16} className="text-[#ff2e88]" />
              <span>MENU</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-['Barlow_Condensed'] font-bold tracking-wider text-white">
              <span className="w-2 h-2 rounded-full bg-[#ff2e88] animate-ping" />
              <span className="text-[#ff2e88] tracking-widest uppercase">GTA: VICE PORTFOLIO</span>
            </div>
          )}

          {/* SFX Toggle Button for Mobile */}
          <button
            type="button"
            onClick={handleToggleSfx}
            className={`p-1.5 rounded border transition-colors cursor-pointer ${
              sfxOn
                ? 'border-white/15 bg-black/40 text-[#5fd068]'
                : 'border-white/10 bg-black/30 text-[#b9b4ab]'
            }`}
            title="Toggle sound effects"
            aria-label={sfxOn ? 'Mute sound effects' : 'Unmute sound effects'}
          >
            {sfxOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>

        {/* Center: Current screen name badge */}
        {!isMenu && (
          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-black/40 border border-white/10 text-[15px] font-['Barlow_Condensed'] font-bold uppercase tracking-wider truncate max-w-[130px] sm:max-w-[200px]">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: current.accent }} />
            <span className="truncate" style={{ color: current.accent }}>
              {current.label}
            </span>
          </div>
        )}

        {/* Right side stats */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative">
          <Clock className="font-['Barlow_Condensed'] font-bold text-white text-[14px] tracking-wide leading-none" />
          <Money
            showDelta={false}
            className="flex items-center"
            amountClassName="font-['Barlow_Condensed'] font-bold text-[#5fd068] text-[14px] tracking-wide leading-none"
          />
          <Stars size={11} gap="gap-0.5" />

          {/* Quick Loadout FAB / trigger button */}
          <button
            type="button"
            onClick={handleOpenLoadout}
            className={`relative flex flex-col items-center justify-center w-8 h-8 rounded border transition-all cursor-pointer ${
              equipped
                ? 'bg-[#38d6ff]/20 border-[#38d6ff] text-[#38d6ff]'
                : 'bg-white/5 border-white/20 text-white hover:border-[#ff2e88]'
            } ${
              pulseLoadout ? 'animate-pulse ring-2 ring-[#ff2e88]/50' : ''
            }`}
            title="Open Loadout"
          >
            {equipped && loadoutProof[equipped] ? (
              (() => {
                const IconComp = ICON_MAP[loadoutProof[equipped].icon] || Crosshair;
                return <IconComp size={18} />;
              })()
            ) : (
              <Crosshair size={18} />
            )}
            <span className="font-['Barlow_Condensed'] font-bold text-[8px] uppercase tracking-tighter leading-none mt-[-1px]">
              {equipped ? (loadoutProof[equipped]?.short || 'STACK') : 'STACK'}
            </span>
          </button>

          {/* First-visit tooltip */}
          {showLoadoutTooltip && (
            <button
              type="button"
              onClick={handleOpenLoadout}
              className="absolute right-0 top-12 z-50 bg-[#ff2e88] text-white px-2.5 py-1 rounded text-[11px] font-['Barlow_Condensed'] font-bold uppercase tracking-wider whitespace-nowrap shadow-xl animate-bounce cursor-pointer flex items-center gap-1 border-0"
            >
              <span>Tap to see my tech stack</span>
              <span className="absolute -top-1.5 right-3.5 w-3 h-3 bg-[#ff2e88] rotate-45 pointer-events-none" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
