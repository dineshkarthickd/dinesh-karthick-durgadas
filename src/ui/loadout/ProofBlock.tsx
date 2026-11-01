import React from 'react';
import { loadoutProof, FALLBACK_PROOF } from '../../data/loadoutProof';
import { projects, experience } from '../../data/portfolio';

interface ProofBlockProps {
  tree: string;
  onNavProject: (pid: string) => void;
  onNavJob: () => void;
  onNavCerts: (tree: string) => void;
}

export const ProofBlock: React.FC<ProofBlockProps> = ({
  tree,
  onNavProject,
  onNavJob,
  onNavCerts,
}) => {
  const currentProof = (loadoutProof as Record<string, typeof FALLBACK_PROOF>)[tree] || FALLBACK_PROOF;
  const currentJob = experience[0]
    ? `${experience[0].company} · ${experience[0].role}`
    : 'Codunt Technologies · Software Engineer';

  const getProjectName = (id: string) => {
    return projects.find((p) => p.id === id)?.name || id;
  };

  const hasProof =
    currentProof.projects.length > 0 || currentProof.job || currentProof.certs.length > 0;

  return (
    <div className="w-full flex flex-col gap-1.5 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-left text-xs">
      {currentProof.projects.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-['Barlow_Condensed'] font-bold text-[10.5px] uppercase tracking-wider text-[#2ee6c5] shrink-0">
            🗂 PROJECTS:
          </span>
          <div className="flex flex-wrap gap-1">
            {currentProof.projects.map((pid) => (
              <button
                key={pid}
                type="button"
                onClick={() => onNavProject(pid)}
                className="px-1.5 py-0.5 rounded bg-[#2ee6c5]/15 hover:bg-[#2ee6c5] hover:text-black border border-[#2ee6c5]/40 text-[#2ee6c5] text-[10px] font-['Barlow_Condensed'] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {getProjectName(pid)}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentProof.job && (
        <div className="flex items-center gap-1.5">
          <span className="font-['Barlow_Condensed'] font-bold text-[10.5px] uppercase tracking-wider text-[#8b7bff] shrink-0">
            💼 JOB:
          </span>
          <button
            type="button"
            onClick={onNavJob}
            className="text-[11px] text-white/90 hover:text-[#8b7bff] font-['Inter'] hover:underline truncate cursor-pointer"
          >
            {currentJob}
          </button>
        </div>
      )}

      {currentProof.certs.length > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="font-['Barlow_Condensed'] font-bold text-[10.5px] uppercase tracking-wider text-[#ffc23d] shrink-0">
            🏅 CERTIFIED:
          </span>
          <button
            type="button"
            onClick={() => onNavCerts(tree)}
            className="text-[10.5px] text-white/90 hover:text-[#ffc23d] font-['Inter'] hover:underline truncate cursor-pointer"
            title={currentProof.certs.join(' · ')}
          >
            {currentProof.certs.length}{' '}
            {currentProof.certs.length === 1 ? 'certificate' : 'certificates'} ·{' '}
            {currentProof.certs[0]}
          </button>
        </div>
      )}

      {!hasProof && (
        <div className="text-[10.5px] text-[#b9b4ab] font-['Barlow_Condensed'] uppercase tracking-wider italic">
          Side Quest · Continuously refined in personal projects
        </div>
      )}
    </div>
  );
};
