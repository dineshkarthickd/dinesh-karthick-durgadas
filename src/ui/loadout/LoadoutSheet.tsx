import React from 'react';
import { ChevronDown, Crosshair } from 'lucide-react';
import { skills } from '../../data/portfolio';
import { loadoutProof, FALLBACK_PROOF } from '../../data/loadoutProof';
import { ICON_MAP } from '../../data/icons';
import { ProofBlock } from './ProofBlock';
import { EquipButton } from './EquipButton';

interface LoadoutSheetProps {
  selectedIndex: number;
  expandedIndex: number | null;
  onToggleExpand: (index: number) => void;
  onEquipIndex: (index: number) => void;
  equippedTree: string | null;
  onNavProject: (pid: string) => void;
  onNavJob: () => void;
  onNavCerts: (tree: string) => void;
}

export const LoadoutSheet: React.FC<LoadoutSheetProps> = ({
  expandedIndex,
  onToggleExpand,
  onEquipIndex,
  equippedTree,
  onNavProject,
  onNavJob,
  onNavCerts,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-[var(--m-gutter)] py-3 space-y-2">
      {skills.map((skill, idx) => {
        const isExpanded = expandedIndex === idx;
        const isEquipped = equippedTree === skill.tree;
        const proof = loadoutProof[skill.tree] || FALLBACK_PROOF;
        const IconComponent = ICON_MAP[proof.icon] || Crosshair;

        return (
          <div
            key={skill.tree}
            className={`rounded-xl border transition-all ${
              isEquipped
                ? 'bg-[#38d6ff]/10 border-[#38d6ff]/40'
                : isExpanded
                ? 'bg-black/60 border-white/20'
                : 'bg-black/30 border-white/10'
            }`}
          >
            {/* Row Header */}
            <button
              type="button"
              onClick={() => onToggleExpand(idx)}
              className="w-full flex items-center justify-between p-3 cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isEquipped
                      ? 'bg-[#38d6ff]/20 text-[#38d6ff]'
                      : 'bg-white/5 text-white/80'
                  }`}
                >
                  <IconComponent size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Anton'] text-lg uppercase tracking-wide text-white">
                      {skill.tree}
                    </span>
                    {isEquipped && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-['Barlow_Condensed'] font-bold uppercase tracking-wider bg-[#5fd068]/20 text-[#5fd068] border border-[#5fd068]/40">
                        EQUIPPED
                      </span>
                    )}
                  </div>
                  <div className="font-['Barlow_Condensed'] text-[12.5px] text-[#5fd068]">
                    PROFICIENCY: {skill.level}%
                  </div>
                </div>
              </div>

              <ChevronDown
                size={18}
                className={`text-white/60 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-3 pb-3 pt-1 border-t border-white/5 flex flex-col gap-2.5">
                {/* Level Bar */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#ffc23d] to-[#38d6ff]"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>

                {/* Tool Chips */}
                <div className="flex flex-wrap gap-1">
                  {skill.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2 py-0.5 rounded-full bg-[#38d6ff]/10 border border-[#38d6ff]/35 text-[11px] font-['Barlow_Condensed'] font-semibold text-white tracking-wide"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                {/* Proof Block */}
                <ProofBlock
                  tree={skill.tree}
                  onNavProject={onNavProject}
                  onNavJob={onNavJob}
                  onNavCerts={onNavCerts}
                />

                {/* Equip Button */}
                <div className="mt-1">
                  <EquipButton
                    isEquipped={isEquipped}
                    onEquip={() => onEquipIndex(idx)}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
