import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Trophy, FileText, CheckCircle2 } from 'lucide-react';
import { ScreenShell } from '../ui/ScreenShell';
import { CertificateViewer } from '../ui/CertificateViewer';
import { certificates, type Tier, type SkillTree } from '../data/portfolio';
import { loadoutProof } from '../data/loadoutProof';
import { useUi, useGameActions } from '../game/GameContext';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { haptic } from '../lib/feedback';
import { playMoveSound } from '../lib/sfx';

const ACCENT = '#e64bff';

type Tab = 'ALL' | 'GOLD' | 'SILVER' | 'BRONZE';

const TAB_TIER_MAP: Record<Tab, Tier | null> = {
  ALL: null,
  GOLD: 'gold',
  SILVER: 'silver',
  BRONZE: 'bronze',
};

const TIER_COLORS: Record<Tier, { bg: string; text: string; icon: string }> = {
  gold: { bg: '#ffc23d', text: '#000000', icon: '🥇' },
  silver: { bg: '#c9d1d9', text: '#000000', icon: '🥈' },
  bronze: { bg: '#cd7f32', text: '#ffffff', icon: '🥉' },
};

export const Achievements: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { equipped } = useUi();
  const { unequipTree } = useGameActions();
  const [activeTab, setActiveTab] = useState<Tab>('ALL');
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const achievementsListRef = useRef<HTMLDivElement | null>(null);
  useSmoothScroll(achievementsListRef, true);

  const skillParam = searchParams.get('skill');
  const activeTree = (skillParam || equipped) as SkillTree | null;

  const goldCount = useMemo(() => certificates.filter((c) => c.tier === 'gold').length, []);
  const silverCount = useMemo(() => certificates.filter((c) => c.tier === 'silver').length, []);
  const bronzeCount = useMemo(() => certificates.filter((c) => c.tier === 'bronze').length, []);

  const matchingCertTitles = useMemo(() => {
    if (!activeTree || !loadoutProof[activeTree]) return null;
    return new Set(loadoutProof[activeTree].certs || []);
  }, [activeTree]);

  const filteredCerts = useMemo(() => {
    let list = [];
    const targetTier = TAB_TIER_MAP[activeTab];

    if (targetTier === null) {
      const gold = certificates
        .filter((c) => c.tier === 'gold')
        .sort((a, b) => b.date.localeCompare(a.date));
      const silver = certificates
        .filter((c) => c.tier === 'silver')
        .sort((a, b) => b.date.localeCompare(a.date));
      const bronze = certificates
        .filter((c) => c.tier === 'bronze')
        .sort((a, b) => b.date.localeCompare(a.date));
      list = [...gold, ...silver, ...bronze];
    } else {
      list = certificates
        .filter((c) => c.tier === targetTier)
        .sort((a, b) => b.date.localeCompare(a.date));
    }

    // If active tree filter: matching certificates shown first
    if (matchingCertTitles && matchingCertTitles.size > 0) {
      list = [...list].sort((a, b) => {
        const aMatch = matchingCertTitles.has(a.title);
        const bMatch = matchingCertTitles.has(b.title);
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
    }

    return list;
  }, [activeTab, matchingCertTitles]);

  const handleClearFilter = () => {
    haptic(10);
    if (skillParam) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('skill');
          return next;
        },
        { replace: true }
      );
    }
    if (equipped) {
      unequipTree();
    }
  };

  const handleCloseViewer = useCallback(() => {
    setViewerIndex(null);
  }, []);

  return (
    <>
      <ScreenShell
        artSrc="/art/achievements.webp"
        artAlt="Illustration of Dinesh Karthick surrounded by trophies on Neon Strip"
        title="ACHIEVEMENTS"
        subtitle="Trophies"
        accentColor={ACCENT}
        sectionId="achievements"
      >
        {/* Sticky Header Container */}
        <div className="sticky top-0 bg-[#07060a] z-10 -mt-1 pt-1 pb-2 pr-3 flex flex-col gap-2 border-b border-white/10">
          {/* Header Counter Line */}
          <div className="flex flex-wrap items-center justify-between gap-2 pr-1">
            <span className="font-['Barlow_Condensed'] font-bold text-xs lg:text-sm uppercase tracking-wider text-white whitespace-nowrap">
              {certificates.length} TROPHIES UNLOCKED
            </span>
            <div className="flex items-center gap-2.5 sm:gap-3 font-['Barlow_Condensed'] font-bold text-xs lg:text-sm text-[#b9b4ab] whitespace-nowrap shrink-0">
              <span className="flex items-center gap-1 text-[#ffc23d]">🥇 {goldCount}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#c9d1d9]">🥈 {silverCount}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#cd7f32]">🥉 {bronzeCount}</span>
            </div>
          </div>

          {/* Tabs + Equipped/Skill Filter Pill */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {(['ALL', 'GOLD', 'SILVER', 'BRONZE'] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      if (activeTab !== tab) {
                        haptic(10);
                        playMoveSound();
                        setActiveTab(tab);
                      }
                    }}
                    className={`px-3 h-[30px] flex items-center justify-center rounded font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#e64bff] text-white shadow-[0_2px_10px_rgba(230,75,255,0.4)]'
                        : 'bg-white/5 text-[#b9b4ab] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {activeTree && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38d6ff]/15 border border-[#38d6ff]/40 text-[#38d6ff] font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider">
                <span>FILTER: {loadoutProof[activeTree]?.short || activeTree}</span>
                <button
                  type="button"
                  onClick={handleClearFilter}
                  className="hover:text-white ml-0.5 cursor-pointer leading-none font-bold"
                  title="Clear active filter"
                  aria-label="Clear active filter"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Certificates List */}
        <div ref={achievementsListRef} className="space-y-2 lg:space-y-1.5 my-2 pr-1">
          {filteredCerts.map((cert) => {
            const tierInfo = TIER_COLORS[cert.tier];
            const isMatch = matchingCertTitles ? matchingCertTitles.has(cert.title) : false;

            return (
              <div
                key={cert.preview}
                className={`p-[var(--m-card-pad)] lg:p-[10px_12px] rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:gap-2 ${
                  isMatch
                    ? 'bg-[#38d6ff]/10 border-[#38d6ff]/40 shadow-[0_0_15px_rgba(56,214,255,0.15)]'
                    : 'bg-[#0a0a0e]/90 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Left: Icon + Info */}
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="w-[var(--m-card-icon-box)] h-[var(--m-card-icon-box)] lg:w-8 lg:h-8 rounded flex items-center justify-center shrink-0 text-base shadow [&>svg]:w-[var(--m-card-icon-glyph)] [&>svg]:h-[var(--m-card-icon-glyph)] lg:[&>svg]:w-4 lg:[&>svg]:h-4"
                    style={{ backgroundColor: tierInfo.bg, color: tierInfo.text }}
                  >
                    <Trophy size={16} />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-['Barlow_Condensed'] font-bold card-title-mobile lg:text-[12px] uppercase tracking-wide text-white truncate">
                        {cert.title}
                      </span>
                    </div>

                    <div className="card-text-mobile lg:text-[11.5px] text-[#b9b4ab] mt-0.5 font-['Inter'] leading-tight sm:flex sm:items-center sm:flex-nowrap min-w-0">
                      <span className="block sm:inline truncate">{cert.issuer}</span>
                      <span className="hidden sm:inline text-white/20 mx-1.5 shrink-0">·</span>
                      <span className="block sm:inline font-mono text-[11px] text-neutral-300 whitespace-nowrap shrink-0">{cert.date}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      const idx = filteredCerts.findIndex((c) => c.preview === cert.preview);
                      setViewerIndex(idx >= 0 ? idx : 0);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 lg:px-2 lg:py-0.5 rounded bg-white/10 hover:bg-[#e64bff] hover:text-white text-[11px] lg:text-[10.5px] font-['Barlow_Condensed'] font-bold uppercase tracking-wider text-neutral-200 transition-colors cursor-pointer"
                  >
                    <FileText size={12} />
                    VIEW
                  </button>

                  {cert.verify && (
                    <a
                      href={cert.verify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#5fd068]/20 hover:bg-[#5fd068] text-[#5fd068] hover:text-black text-[11px] font-['Barlow_Condensed'] font-bold uppercase tracking-wider transition-colors border border-[#5fd068]/40"
                    >
                      <CheckCircle2 size={12} />
                      VERIFY
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScreenShell>

      {viewerIndex !== null && (
        <CertificateViewer
          certificates={filteredCerts}
          initialIndex={viewerIndex}
          onClose={handleCloseViewer}
        />
      )}
    </>
  );
};
