import React, { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { ScreenShell } from '../ui/ScreenShell';
import { ProjectBriefingModal } from '../ui/ProjectBriefingModal';
import { projects } from '../data/portfolio';
import { loadoutProof } from '../data/loadoutProof';
import { useUi, useGameActions } from '../game/GameContext';
import { haptic } from '../lib/feedback';
import { playSelectSound, playBackSound } from '../lib/sfx';

const ACCENT = '#2ee6c5';

type Project = (typeof projects)[number];

export const Projects: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { equipped } = useUi();
  const { unequipTree } = useGameActions();

  const openParam = searchParams.get('open');
  const selectedProject = useMemo<Project | null>(
    () => (openParam ? projects.find((p) => p.id === openParam) || null : null),
    [openParam]
  );

  const handleCloseProject = useCallback(() => {
    haptic(10);
    playBackSound();
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('open');
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  const handleOpenProject = (proj: Project) => {
    haptic(10);
    playSelectSound();
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('open', proj.id);
        return next;
      },
      { replace: true }
    );
  };

  // Proof matching filter: when a tree is equipped, matching projects stay normal,
  // others are dimmed (opacity .35, grayscale) and sorted last
  const matchingProjectIds = useMemo(() => {
    if (!equipped) return null;
    return new Set(loadoutProof[equipped]?.projects || []);
  }, [equipped]);

  const sortedProjects = useMemo(() => {
    if (!matchingProjectIds) return projects;
    return [...projects].sort((a, b) => {
      const aMatch = matchingProjectIds.has(a.id);
      const bMatch = matchingProjectIds.has(b.id);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }, [matchingProjectIds]);

  const matchCount = useMemo(() => {
    if (!matchingProjectIds) return projects.length;
    return projects.filter((p) => matchingProjectIds.has(p.id)).length;
  }, [matchingProjectIds]);

  const handleClearFilter = () => {
    haptic(10);
    if (searchParams.has('open')) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('open');
          return next;
        },
        { replace: true }
      );
    }
    if (equipped) {
      unequipTree();
    }
  };

  return (
    <>
      <ScreenShell
        artSrc="/art/projects.webp"
        artAlt="Illustration of Dinesh Karthick working at a beachfront cafe"
        title="PROJECTS"
        subtitle="Missions"
        accentColor={ACCENT}
        sectionId="projects"
      >
        {/* Equipped filter banner */}
        {equipped && (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#38d6ff]/10 border border-[#38d6ff]/40 text-[#38d6ff] font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider mb-3">
            <span>
              FILTERED BY {loadoutProof[equipped]?.short || equipped} ({matchCount} matching)
            </span>
            <button
              type="button"
              onClick={handleClearFilter}
              className="hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>CLEAR</span>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-2">
          {sortedProjects.map((project) => {
            const isMatch = matchingProjectIds ? matchingProjectIds.has(project.id) : true;

            return (
              <div
                key={project.id}
                onClick={() => handleOpenProject(project)}
                className={`p-[var(--m-card-pad)] lg:p-4 rounded-xl border bg-[#0a0a0e]/85 backdrop-blur-md flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                  isMatch
                    ? 'border-white/10 hover:border-[#2ee6c5] hover:shadow-[0_0_20px_rgba(46,230,197,0.3)]'
                    : 'opacity-35 grayscale border-white/5 hover:opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider text-[#2ee6c5]">
                      MISSION
                    </span>
                    {project.classified && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-['Barlow_Condensed'] font-bold uppercase tracking-wider bg-red-950/80 border border-red-500/50 text-red-300">
                        CLASSIFIED
                      </span>
                    )}
                  </div>

                  <h3 className="font-['Anton'] text-[17px] sm:text-xl lg:text-xl uppercase tracking-wider text-white mt-1">
                    {project.name}
                  </h3>

                  <p className="font-['Inter'] text-[var(--m-card-text)] text-[#b9b4ab] mt-1 line-clamp-2">
                    {project.oneLiner}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1 max-w-[70%]">
                    {project.tech.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 rounded text-[10px] font-['Barlow_Condensed'] bg-white/5 text-neutral-300"
                      >
                        {t}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="text-[10px] font-['Barlow_Condensed'] text-[#b9b4ab] self-center">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>

                  <span className="font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider text-[#2ee6c5]">
                    BRIEFING →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ScreenShell>

      <ProjectBriefingModal
        project={selectedProject}
        accentColor={ACCENT}
        onClose={handleCloseProject}
      />
    </>
  );
};
