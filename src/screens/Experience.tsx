import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenShell } from '../ui/ScreenShell';
import { PrimaryButton } from '../ui/PrimaryButton';
import { experience, ownWords, computeDuration } from '../data/portfolio';

const ACCENT = '#8b7bff';

export const Experience: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ScreenShell
      artSrc="/art/experience.webp"
      artAlt="Illustration of Dinesh Karthick working at Codunt Tower"
      title="EXPERIENCE"
      subtitle="Journey"
      accentColor={ACCENT}
      sectionId="experience"
    >
      {/* Vertical Timeline */}
      <div className="relative pl-6 border-l-2 border-[#8b7bff]/40 space-y-6 my-2">
        {experience.map((item) => {
          const liveDuration = item.end ? '' : computeDuration(item.start);

          return (
            <div key={item.company} className="relative">
              {/* Timeline Dot */}
              <div
                className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#07060a] shadow-[0_0_10px_#8b7bff]"
                style={{ backgroundColor: ACCENT }}
              />

              {/* Date Header + Live Duration Chip */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-[0.2em] text-[#8b7bff]">
                  DEC 2024 – PRESENT
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#8b7bff]/20 border border-[#8b7bff]/50 text-[#f2efe9] font-['Barlow_Condensed'] font-bold text-[11px] tracking-wider uppercase">
                  {liveDuration}
                </span>
              </div>

              {/* Role & Company */}
              <h2 className="font-['Barlow_Condensed'] font-bold text-xl sm:text-2xl lg:text-[18px] text-white uppercase tracking-wide mt-1">
                {item.role}{' '}
                <span className="text-[#8b7bff] font-normal">@ {item.company}</span>
              </h2>

              {/* Bullet Points */}
              <ul className="mt-2 space-y-1.5 font-['Inter'] text-xs sm:text-[14px] lg:text-[13.5px] text-[#f2efe9]/85 leading-snug list-disc list-inside marker:text-[#8b7bff]">
                {item.points.map((pt, idx) => (
                  <li key={idx} className="pl-1">
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Dinesh's Own Words Quote Block */}
      <div
        className="mt-2.5 p-3.5 sm:p-4 lg:py-2.5 lg:px-3.5 rounded-r-lg bg-[rgba(10,10,14,0.75)] backdrop-blur-md border border-white/10"
        style={{ borderLeft: `4px solid ${ACCENT}` }}
      >
        <p className="font-['Inter'] italic text-xs sm:text-[13px] lg:text-[12.5px] text-[#b9b4ab] leading-relaxed">
          "{ownWords}"
        </p>
      </div>

      {/* Next Button */}
      <div className="mt-4">
        <PrimaryButton accentColor={ACCENT} onClick={() => navigate('/achievements')}>
          NEXT: ACHIEVEMENTS
        </PrimaryButton>
      </div>
    </ScreenShell>
  );
};
