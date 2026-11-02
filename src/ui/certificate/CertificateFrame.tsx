import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  AlertCircle,
} from 'lucide-react';
import type { Certificate } from '../../data/portfolio';
import { TIER_META } from '../../data/tiers';

interface CertificateFrameProps {
  currentCert: Certificate;
  currentIndex: number;
  totalCerts: number;
  isZoomed: boolean;
  panOffset: { x: number; y: number };
  isBlurred: boolean;
  previewSrc: string | null;
  isLoading: boolean;
  isError: boolean;
  onToggleZoom: () => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onUnblur: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  dialogCardRef: React.RefObject<HTMLDivElement | null>;
  closeBtnRef: React.RefObject<HTMLButtonElement | null>;
  prefersReduced: boolean;
}

export const CertificateFrame: React.FC<CertificateFrameProps> = ({
  currentCert,
  currentIndex,
  totalCerts,
  isZoomed,
  panOffset,
  isBlurred,
  previewSrc,
  isLoading,
  isError,
  onToggleZoom,
  onClose,
  onPrev,
  onNext,
  onUnblur,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  dialogCardRef,
  closeBtnRef,
  prefersReduced,
}) => {
  const [todayDate] = useState(() => new Date().toISOString().slice(0, 10));
  const tierStyle = TIER_META[currentCert.tier] || TIER_META.bronze;

  // Watermark pattern: light layer at x='261' y='191'
  const watermarkPattern = useMemo(() => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='240' viewBox='0 0 480 240'>
      <text x='20' y='70' transform='rotate(-28 240 120)' fill='#000000' fill-opacity='0.11' font-family='Arial, sans-serif' font-weight='bold' font-size='13' letter-spacing='1.5'>VIEWED ${todayDate} · DK PORTFOLIO</text>
      <text x='21' y='71' transform='rotate(-28 240 120)' fill='#ffffff' fill-opacity='0.10' font-family='Arial, sans-serif' font-weight='bold' font-size='13' letter-spacing='1.5'>VIEWED ${todayDate} · DK PORTFOLIO</text>
      <text x='260' y='190' transform='rotate(-28 240 120)' fill='#000000' fill-opacity='0.11' font-family='Arial, sans-serif' font-weight='bold' font-size='13' letter-spacing='1.5'>VIEWED ${todayDate} · DK PORTFOLIO</text>
      <text x='261' y='191' transform='rotate(-28 240 120)' fill='#ffffff' fill-opacity='0.10' font-family='Arial, sans-serif' font-weight='bold' font-size='13' letter-spacing='1.5'>VIEWED ${todayDate} · DK PORTFOLIO</text>
    </svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }, [todayDate]);

  return (
    <motion.div
      ref={dialogCardRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-viewer-title"
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
      animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 26, stiffness: 280 }}
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-[min(1100px,94vw)] max-h-[90dvh] bg-[#0a0a0e]/95 rounded-xl flex flex-col overflow-hidden shadow-2xl"
      style={{
        border: `2px solid ${tierStyle.border}`,
        boxShadow: `0 0 36px ${tierStyle.glow}, 0 24px 50px rgba(0,0,0,0.9)`,
      }}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 sm:px-5 sm:py-3 border-b border-white/10 bg-black/70 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span
            className="px-2.5 py-0.5 rounded font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider shrink-0 flex items-center gap-1"
            style={{ backgroundColor: tierStyle.color, color: tierStyle.text }}
          >
            {currentCert.tier === 'gold' ? '🥇' : currentCert.tier === 'silver' ? '🥈' : '🥉'}{' '}
            {currentCert.tier.toUpperCase()} TIER
          </span>
          <h2
            id="cert-viewer-title"
            className="font-['Anton'] text-base sm:text-xl text-white tracking-wider truncate"
          >
            TROPHY UNLOCKED
          </h2>
          <span className="text-xs sm:text-sm font-['Barlow_Condensed'] font-bold text-[#b9b4ab] shrink-0">
            ({currentIndex + 1} / {totalCerts})
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Zoom toggle button */}
          <button
            type="button"
            onClick={onToggleZoom}
            aria-label={isZoomed ? 'Reset Zoom' : '2x Zoom'}
            className="p-1.5 sm:p-2 rounded bg-white/10 hover:bg-white/20 text-[#b9b4ab] hover:text-white transition-colors cursor-pointer"
            title={isZoomed ? 'Reset Zoom' : '2x Zoom'}
          >
            {isZoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
          </button>

          {/* Top-Right Close Button */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close certificate viewer"
            className="p-1.5 sm:p-2 rounded bg-white/10 hover:bg-vice-pink hover:text-white text-[#b9b4ab] transition-colors cursor-pointer"
            title="Close (ESC)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Certificate Display Area (touch-none when zoomed) */}
      <div
        className={`relative flex-1 min-h-[260px] sm:min-h-[400px] lg:min-h-[500px] max-h-[66vh] flex items-center justify-center p-3 sm:p-5 bg-black/50 overflow-hidden cursor-grab active:cursor-grabbing ${
          isZoomed ? 'touch-none' : ''
        }`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onDoubleClick={onToggleZoom}
      >
        {/* Main Background Image Div with transform */}
        {!isLoading && !isError && previewSrc && (
          <div
            className="absolute inset-3 sm:inset-5 transition-transform duration-150 ease-out"
            style={{
              backgroundImage: `url("${previewSrc}")`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transform: isZoomed
                ? `scale(2) translate(${panOffset.x / 2}px, ${panOffset.y / 2}px)`
                : 'scale(1) translate(0px, 0px)',
              filter: isBlurred ? 'blur(28px)' : 'none',
            }}
          />
        )}

        {/* Error message */}
        {isError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center z-10">
            <AlertCircle size={32} className="text-[#ff4d5e]" />
            <span className="font-['Barlow_Condensed'] font-bold text-lg uppercase tracking-wide text-white">
              Preview unavailable — use VERIFY
            </span>
            {currentCert.verify && (
              <a
                href={currentCert.verify}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded bg-[#5fd068] text-black font-['Barlow_Condensed'] font-bold text-sm uppercase tracking-wider"
              >
                VERIFY ORIGINAL ISSUER
              </a>
            )}
          </div>
        )}

        {/* CRT Scanlines */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 3px)',
          }}
        />

        {/* Dynamic Repeating SVG Date Watermark */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            backgroundImage: watermarkPattern,
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Transparent Overlay to block right-click image save and drag-and-drop */}
        <div
          className="absolute inset-0 z-20 bg-transparent select-none"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Capture Protection Overlay */}
        {isBlurred && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onUnblur();
            }}
            className="absolute inset-0 z-30 flex items-center justify-center cursor-pointer p-4"
          >
            <div className="px-5 py-3 rounded-lg bg-black/85 border border-[#ffc23d]/60 backdrop-blur-md shadow-2xl flex items-center gap-3 animate-pulse">
              <AlertCircle size={22} className="text-[#ffc23d] shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-['Anton'] text-base tracking-wider uppercase text-[#ffc23d]">
                  PROTECTED VIEW
                </span>
                <span className="font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider text-neutral-300">
                  Click anywhere to resume
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Loading spinner if image is fetching */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="px-3.5 py-3 sm:px-5 sm:py-3.5 bg-[#07060a]/95 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex flex-col min-w-0 pr-2">
          <h3 className="font-['Barlow_Condensed'] font-bold text-sm sm:text-base uppercase tracking-wide text-white truncate">
            {currentCert.title}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5 font-['Inter'] text-[12.5px] text-[#b9b4ab] mt-0.5">
            <span>{currentCert.issuer}</span>
            <span className="hidden sm:inline text-white/30">·</span>
            <span className="whitespace-nowrap font-mono text-[11px] sm:text-xs text-neutral-300">
              {currentCert.date}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrev}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 font-['Barlow_Condensed'] font-bold text-xs sm:text-sm uppercase tracking-wider text-white transition-colors cursor-pointer"
              title="Previous certificate (←)"
            >
              <ChevronLeft size={16} />
              <span>PREV</span>
            </button>
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 font-['Barlow_Condensed'] font-bold text-xs sm:text-sm uppercase tracking-wider text-white transition-colors cursor-pointer"
              title="Next certificate (→)"
            >
              <span>NEXT</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {currentCert.verify && (
            <a
              href={currentCert.verify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3.5 py-1.5 rounded bg-[#5fd068] hover:bg-[#4ebb57] text-black font-['Barlow_Condensed'] font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-md"
            >
              <span>VERIFY</span>
              <ExternalLink size={14} />
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-white/10 hover:bg-vice-pink hover:text-white font-['Barlow_Condensed'] font-bold text-xs sm:text-sm uppercase tracking-wider text-neutral-300 transition-colors cursor-pointer"
          >
            <span>CLOSE</span>
            <span className="hidden lg:inline"> (ESC)</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
