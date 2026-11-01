import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';
import { useModal } from './useModal';
import { useHotkeys } from '../lib/inputLayer';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import type { projects } from '../data/portfolio';

type Project = (typeof projects)[number];

interface ProjectBriefingModalProps {
  project: Project | null;
  accentColor: string;
  onClose: () => void;
}

export const ProjectBriefingModal: React.FC<ProjectBriefingModalProps> = ({
  project,
  accentColor,
  onClose,
}) => {
  const briefingPanelRef = useRef<HTMLDivElement | null>(null);
  const briefingCloseBtnRef = useRef<HTMLButtonElement | null>(null);
  useSmoothScroll(briefingPanelRef, !!project);

  useModal({
    isOpen: !!project,
    containerRef: briefingPanelRef,
    initialFocusRef: briefingCloseBtnRef,
    onClose,
  });

  useHotkeys(
    'briefing',
    {
      Escape: (e) => {
        e.preventDefault();
        onClose();
      },
    },
    Boolean(project)
  );

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md select-none"
          onClick={onClose}
        >
          <motion.div
            ref={briefingPanelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="briefing-title"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0a0a0e] border-2 rounded-xl p-5 sm:p-7 shadow-2xl flex flex-col justify-between"
            style={{ borderColor: accentColor }}
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div
                    className="font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-[0.25em]"
                    style={{ color: accentColor }}
                  >
                    MISSION BRIEFING
                  </div>
                  <h2
                    id="briefing-title"
                    className="font-['Anton'] text-2xl sm:text-3xl uppercase tracking-wider text-white mt-1"
                  >
                    {project.name}
                  </h2>
                </div>

                <button
                  ref={briefingCloseBtnRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close mission briefing"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-[#b9b4ab] hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Classified Banner */}
              {project.classified && (
                <div className="mt-4 p-3 rounded-lg bg-red-950/70 border border-red-500/80 flex items-center gap-2.5 text-red-200">
                  <ShieldAlert size={20} className="shrink-0 text-red-400" />
                  <span className="font-['Barlow_Condensed'] font-bold uppercase tracking-wider text-xs sm:text-sm">
                    PRIVATE CLIENT PROJECT — only the login screen is public
                  </span>
                </div>
              )}

              {/* Screenshot Display Frame */}
              <div className="mt-5 rounded-xl overflow-hidden border border-white/20 bg-black/60 shadow-inner">
                <div className="bg-[#181924] px-3 py-2 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="font-['Barlow_Condensed'] text-[11px] text-[#b9b4ab] tracking-wider truncate max-w-[200px]">
                    {project.live}
                  </span>
                  <div className="w-8" />
                </div>

                <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                  <img
                    src={project.image}
                    alt={`${project.name} desktop preview`}
                    className="hidden sm:block w-full h-full object-cover object-top"
                  />
                  <img
                    src={project.imageMobile}
                    alt={`${project.name} mobile preview`}
                    className="sm:hidden w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-5">
                <h3 className="font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider text-[#b9b4ab]">
                  OPERATION INTEL
                </h3>
                <p className="font-['Inter'] text-sm sm:text-[15px] leading-relaxed text-[#f2efe9]/90 mt-1">
                  {project.description}
                </p>
              </div>

              {/* Tech Chips */}
              <div className="mt-5">
                <h3 className="font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider text-[#b9b4ab] mb-2">
                  TECH LOADOUT
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md bg-[#2ee6c5]/10 border border-[#2ee6c5]/40 text-[#2ee6c5] font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
              <PrimaryButton
                accentColor={accentColor}
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.classified ? 'VIEW LOGIN SCREEN' : 'PLAY MISSION'}
              </PrimaryButton>

              <button
                type="button"
                onClick={onClose}
                className="font-['Barlow_Condensed'] font-bold text-sm uppercase tracking-wider text-[#b9b4ab] hover:text-white transition-colors cursor-pointer"
              >
                CLOSE BRIEFING (ESC)
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
