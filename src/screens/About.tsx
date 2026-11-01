import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, GraduationCap, Compass } from 'lucide-react';
import { ScreenShell } from '../ui/ScreenShell';
import { InfoCard } from '../ui/InfoCard';
import { PrimaryButton } from '../ui/PrimaryButton';
import { profile } from '../data/portfolio';

const ACCENT = '#ff8a3d';

export const About: React.FC = () => {
  const navigate = useNavigate();

  const getCardIcon = (label: string) => {
    switch (label) {
      case 'ROLE':
        return <Briefcase size={18} />;
      case 'LOCATION':
        return <MapPin size={18} />;
      case 'STATUS':
        return <GraduationCap size={18} />;
      default:
        return <Compass size={18} />;
    }
  };

  return (
    <ScreenShell
      artSrc="/art/about.webp"
      artAlt="Illustration of Dinesh Karthick in Vice City looking towards the beach"
      title="ABOUT"
      subtitle="Me"
      accentColor={ACCENT}
      sectionId="about"
    >
      {/* Bio Paragraph */}
      <p className="font-['Inter'] text-[var(--m-body)] leading-[var(--m-lh-body)] lg:text-[15px] lg:leading-[1.55] text-[#f2efe9]/90 max-w-[60ch]">
        {profile.bio}
      </p>

      {/* 3 Info Cards + Quest Card: 1 col on phones, 2 cols on tablets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
        {profile.infoCards.map((card) => (
          <InfoCard
            key={card.label}
            label={card.label}
            value={card.value}
            accentColor={ACCENT}
            icon={getCardIcon(card.label)}
          />
        ))}

        {/* 4th Quest Card: dashed orange border, pulsing dot */}
        <div
          className="relative flex items-center gap-3.5 p-[var(--m-card-pad)] lg:py-3.5 lg:px-4 rounded-lg bg-[rgba(10,10,14,0.72)] backdrop-blur-md border-2 border-dashed border-[#ff8a3d]/80 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all hover:translate-x-1 sm:col-span-2 lg:col-span-1"
        >
          <div className="relative w-3.5 h-3.5 shrink-0 flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff8a3d] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff8a3d]" />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-['Barlow_Condensed'] font-bold text-[var(--m-card-title)] lg:text-[13px] uppercase tracking-wider text-[#ff8a3d]">
              CURRENT QUEST
            </span>
            <span className="font-['Inter'] text-[var(--m-card-text)] lg:text-[14px] text-[#f2efe9] mt-0.5 leading-snug">
              {profile.currentQuest} · <span className="text-[#b9b4ab]">In progress</span>
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="mt-4 sm:mt-6 lg:mt-[clamp(8px,2.2vh,24px)]">
        <PrimaryButton accentColor={ACCENT} onClick={() => navigate('/experience')}>
          VIEW JOURNEY
        </PrimaryButton>
      </div>
    </ScreenShell>
  );
};
