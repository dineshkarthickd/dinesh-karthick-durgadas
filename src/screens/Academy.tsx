import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Award, BookOpen, Laptop } from 'lucide-react';
import { ScreenShell } from '../ui/ScreenShell';
import { PrimaryButton } from '../ui/PrimaryButton';
import { education } from '../data/portfolio';

const ACCENT = '#ff4d5e';

export const Academy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ScreenShell
      artSrc="/art/academy.webp"
      artAlt="Illustration of Dinesh Karthick at University Heights campus"
      title="ACADEMY"
      subtitle="Education"
      accentColor={ACCENT}
      sectionId="academy"
    >
      {/* 2 Education Cards */}
      <div className="flex flex-col gap-2.5 lg:gap-2 my-1">
        {education.map((item) => (
          <div
            key={item.degree}
            className="p-[var(--m-card-pad)] lg:py-2.5 lg:px-3.5 rounded-r-lg bg-[rgba(10,10,14,0.75)] backdrop-blur-md border border-white/10 transition-all hover:translate-x-1"
            style={{ borderLeft: `4px solid ${ACCENT}` }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <GraduationCap size={18} className="text-[#ff4d5e] shrink-0" />
                <h3 className="font-['Barlow_Condensed'] font-bold card-title-mobile lg:text-[16px] uppercase tracking-wide text-white">
                  {item.degree}
                </h3>
              </div>

              {item.inProgress && (
                <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#ff4d5e]/20 border border-[#ff4d5e]/60 text-[#ff4d5e] font-['Barlow_Condensed'] font-bold text-[10px] tracking-widest uppercase animate-pulse">
                  IN PROGRESS
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center justify-between card-text-mobile lg:text-xs text-[#b9b4ab] font-['Inter']">
              <span>{item.institution}</span>
              <span className="font-['Barlow_Condensed'] font-bold uppercase tracking-wider text-[#f2efe9]">
                {item.years}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3 Stat Boxes in a Row */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:gap-2 my-2">
        <div className="p-[var(--m-card-pad)] lg:py-2 lg:px-2 rounded-lg bg-[rgba(10,10,14,0.75)] backdrop-blur-md border border-white/10 text-center flex flex-col items-center">
          <Award size={16} className="text-[#ff4d5e] mb-0.5" />
          <div className="font-['Anton'] text-2xl sm:text-3xl lg:text-[22px] text-[#ff4d5e] leading-none">
            19+
          </div>
          <div className="font-['Barlow_Condensed'] font-bold card-title-mobile lg:text-[11px] uppercase tracking-wider text-[#b9b4ab] mt-1">
            CERTIFICATES
          </div>
        </div>

        <div className="p-[var(--m-card-pad)] lg:py-2 lg:px-2 rounded-lg bg-[rgba(10,10,14,0.75)] backdrop-blur-md border border-white/10 text-center flex flex-col items-center">
          <BookOpen size={16} className="text-[#ff4d5e] mb-0.5" />
          <div className="font-['Anton'] text-2xl sm:text-3xl lg:text-[22px] text-[#ff4d5e] leading-none">
            2
          </div>
          <div className="font-['Barlow_Condensed'] font-bold card-title-mobile lg:text-[11px] uppercase tracking-wider text-[#b9b4ab] mt-1">
            DEGREES
          </div>
        </div>

        <div className="p-[var(--m-card-pad)] lg:py-2 lg:px-2 rounded-lg bg-[rgba(10,10,14,0.75)] backdrop-blur-md border border-white/10 text-center flex flex-col items-center">
          <Laptop size={16} className="text-[#ff4d5e] mb-0.5" />
          <div className="font-['Anton'] text-2xl sm:text-3xl lg:text-[22px] text-[#ff4d5e] leading-none">
            4
          </div>
          <div className="font-['Barlow_Condensed'] font-bold card-title-mobile lg:text-[11px] uppercase tracking-wider text-[#b9b4ab] mt-1">
            LIVE PROJECTS
          </div>
        </div>
      </div>

      {/* Button to Trophies */}
      <div className="mt-4">
        <PrimaryButton accentColor={ACCENT} onClick={() => navigate('/achievements')}>
          VIEW TROPHIES
        </PrimaryButton>
      </div>
    </ScreenShell>
  );
};
