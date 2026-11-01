import React from 'react';
import { skills } from '../../data/portfolio';
import { loadoutProof, FALLBACK_PROOF } from '../../data/loadoutProof';
import { ICON_MAP } from '../../data/icons';
import { ProofBlock } from './ProofBlock';
import { EquipButton } from './EquipButton';
import { playMoveSound } from '../../lib/sfx';
import { Crosshair } from 'lucide-react';

interface LoadoutWheelProps {
  radius: number;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onEquipIndex: (index: number) => void;
  isCurrentEquipped: boolean;
  onNavProject: (pid: string) => void;
  onNavJob: () => void;
  onNavCerts: (tree: string) => void;
  wheelContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const LoadoutWheel: React.FC<LoadoutWheelProps> = ({
  radius,
  selectedIndex,
  onSelectIndex,
  onEquipIndex,
  isCurrentEquipped,
  onNavProject,
  onNavJob,
  onNavCerts,
  wheelContainerRef,
}) => {
  const currentSkill = skills[selectedIndex] || skills[0];
  const stepAngle = 360 / skills.length;

  const handleMouseMoveAim = (e: React.MouseEvent) => {
    if (!wheelContainerRef.current) return;
    const rect = wheelContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.hypot(dx, dy);

    // Aim threshold beyond centre circle dead zone
    if (dist > 60) {
      const deg = Math.atan2(dy, dx) * (180 / Math.PI);
      const relDeg = (deg + 90 + 360) % 360;
      const slotIndex = Math.round(relDeg / stepAngle) % skills.length;
      if (slotIndex !== selectedIndex) {
        playMoveSound();
        onSelectIndex(slotIndex);
      }
    }
  };

  return (
    <div
      ref={wheelContainerRef}
      onMouseMove={handleMouseMoveAim}
      className="relative flex items-center justify-center select-none"
      style={{
        width: `${radius * 2 + 120}px`,
        height: `${radius * 2 + 120}px`,
      }}
    >
      {/* Outer subtle circular ring & tick marks */}
      <div
        className="absolute rounded-full border border-white/10 pointer-events-none"
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
        }}
      />

      {/* Radial skill slots */}
      {skills.map((skill, idx) => {
        const angle = (idx * stepAngle - 90) * (Math.PI / 180);
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const isSelected = idx === selectedIndex;
        const proof = loadoutProof[skill.tree] || FALLBACK_PROOF;
        const IconComponent = ICON_MAP[proof.icon] || Crosshair;

        return (
          <button
            key={skill.tree}
            type="button"
            onClick={() => onSelectIndex(idx)}
            className={`absolute flex flex-col items-center justify-center w-20 h-20 -ml-10 -mt-10 rounded-xl transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-[#0a0a0e] border-2 border-[#ff2e88] shadow-[0_0_25px_rgba(255,46,136,0.6)] scale-110 z-20 text-white'
                : 'bg-black/70 border border-white/15 text-[#b9b4ab] hover:border-white/40 hover:text-white hover:scale-105 z-10'
            }`}
            style={{
              transform: `translate(${x}px, ${y}px) ${isSelected ? 'scale(1.12)' : 'scale(1)'}`,
            }}
            title={`${skill.tree} (${skill.level}%)`}
          >
            <IconComponent size={24} className={isSelected ? 'text-[#ff2e88]' : ''} />
            <span className="font-['Barlow_Condensed'] font-bold text-[11px] uppercase tracking-wider mt-1 text-center leading-tight max-w-[72px] truncate">
              {proof.short || skill.tree}
            </span>
            <span className="font-['Barlow_Condensed'] text-[9px] text-[#5fd068]">
              {skill.level}%
            </span>
          </button>
        );
      })}

      {/* Centre Selected Card */}
      <div className="relative z-10 w-[300px] flex flex-col items-center text-center p-4 rounded-2xl bg-[#0a0a0e]/95 border-2 border-white/15 shadow-[0_0_40px_rgba(0,0,0,0.9)] backdrop-blur-md gap-2.5">
        {/* Header: Label + Anton Name + Level Bar */}
        <div className="flex flex-col items-center">
          <div className="font-['Barlow_Condensed'] font-bold text-[10px] uppercase tracking-[0.25em] text-[#38d6ff]">
            SELECTED TREE
          </div>

          <div className="font-['Anton'] text-[28px] sm:text-[30px] uppercase tracking-wider text-white leading-none mt-1">
            {currentSkill.tree}
          </div>

          <div className="w-[140px] h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ffc23d] to-[#38d6ff] transition-all duration-300"
              style={{ width: `${currentSkill.level}%` }}
            />
          </div>
        </div>

        {/* Tool Chips */}
        <div className="flex flex-wrap justify-center gap-1 max-h-[48px] overflow-y-auto px-2 scrollbar-none my-1">
          {currentSkill.tools.map((tool) => (
            <span
              key={tool}
              className="px-2 py-0.5 rounded-full bg-[#38d6ff]/10 border border-[#38d6ff]/35 text-[11px] font-['Barlow_Condensed'] font-semibold text-white tracking-wide"
            >
              {tool}
            </span>
          ))}
        </div>

        {/* PROOF Block */}
        <ProofBlock
          tree={currentSkill.tree}
          onNavProject={onNavProject}
          onNavJob={onNavJob}
          onNavCerts={onNavCerts}
        />

        {/* Equip Button */}
        <div className="w-full mt-1">
          <EquipButton
            isEquipped={isCurrentEquipped}
            onEquip={() => onEquipIndex(selectedIndex)}
          />
        </div>
      </div>
    </div>
  );
};
