import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { ScreenShell } from '../ui/ScreenShell';
import { skills } from '../data/portfolio';
import { haptic } from '../lib/feedback';
import { playMoveSound } from '../lib/sfx';

const ACCENT = '#38d6ff';

export const Skills: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const prefersReduced = useReducedMotion();

  const toggleRow = (index: number) => {
    haptic(10);
    playMoveSound();
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <ScreenShell
      artSrc="/art/skills.webp"
      artAlt="Illustration of Dinesh Karthick in a futuristic tech workshop"
      title="SKILLS"
      subtitle="Unlocked"
      accentColor={ACCENT}
      sectionId="skills"
    >
      {/* 9 Stat Rows with layout animation so siblings slide smoothly */}
      <motion.div layout className="flex flex-col gap-2.5 lg:gap-2">
        {skills.map((skill, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <motion.button
              layout
              type="button"
              key={skill.tree}
              onClick={() => toggleRow(index)}
              className={`text-left w-full p-[var(--m-card-pad)] lg:px-3 ${
                isExpanded ? 'lg:py-2.5' : 'lg:h-[40px] lg:py-2'
              } flex flex-col justify-center rounded-lg bg-[rgba(10,10,14,0.78)] backdrop-blur-md border transition-all cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.3)] ${
                isExpanded
                  ? 'border-[#38d6ff]/60 shadow-[0_4px_20px_rgba(56,214,255,0.25)]'
                  : 'border-white/10 hover:border-white/25'
              }`}
            >
              {/* Row Header: Name, Progress Bar, Percentage, Chevron (40px tall, 14px labels, bar 6px on desktop) */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="font-['Barlow_Condensed'] font-semibold text-[var(--m-card-title)] lg:text-[14px] uppercase tracking-wider text-white w-28 sm:w-32 lg:w-28 shrink-0 truncate">
                  {skill.tree}
                </span>

                <div className="flex-1 h-2 lg:h-[6px] bg-neutral-900 rounded-full overflow-hidden border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{
                      duration: prefersReduced ? 0.2 : 0.8,
                      delay: prefersReduced ? 0 : index * 0.05,
                      ease: 'easeOut',
                    }}
                    className="h-full bg-gradient-to-r from-[#ffc23d] to-[#38d6ff]"
                  />
                </div>

                <span className="font-['Barlow_Condensed'] font-bold text-[var(--m-card-title)] lg:text-[13px] text-[#38d6ff] w-8 text-right shrink-0">
                  {skill.level}%
                </span>

                <ChevronDown
                  size={16}
                  className={`text-[#b9b4ab] transition-transform duration-200 shrink-0 ${
                    isExpanded ? 'rotate-180 text-[#38d6ff]' : ''
                  }`}
                />
              </div>

              {/* Outer wrapper: only animates height & opacity (no padding/margin/border here) */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="tools"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: 'auto',
                      transition: {
                        height: { type: 'spring', stiffness: 380, damping: 34 },
                        opacity: { duration: 0.2 },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: {
                        height: { duration: 0.2 },
                        opacity: { duration: 0.15 },
                      },
                    }}
                    className="overflow-hidden"
                  >
                    {/* Inner div contains the top margin, padding and border */}
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                      {skill.tools.map((tool, i) => (
                        <motion.span
                          key={tool}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.2 }}
                          className="px-2 py-0.5 rounded-full bg-[#38d6ff]/10 border border-[#38d6ff]/40 text-[11px] font-['Barlow_Condensed'] font-medium text-white tracking-wide"
                        >
                          {tool}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Small Hint */}
      <p className="font-['Barlow_Condensed'] font-bold uppercase tracking-widest text-xs text-[#b9b4ab] mt-1 flex items-center gap-1.5">
        <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white text-[10px]">
          Q
        </span>
        PRESS Q TO OPEN YOUR LOADOUT WHEEL
      </p>
    </ScreenShell>
  );
};
