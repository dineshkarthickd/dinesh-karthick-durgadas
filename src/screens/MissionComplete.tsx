import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenShell } from '../ui/ScreenShell';
import { PrimaryButton } from '../ui/PrimaryButton';
import { useProgress } from '../game/GameContext';
import { TOTAL_SECTIONS } from '../data/routes';

const ACCENT = '#ff2e88';

const TimePlayed: React.FC<{ startedAt: number }> = ({ startedAt }) => {
  const [seconds, setSeconds] = useState<number>(() =>
    Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    }, 1000);
    return () => clearInterval(timer);
  }, [startedAt]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return <span>{`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`}</span>;
};

export const MissionComplete: React.FC = () => {
  const navigate = useNavigate();
  const { xp, visited, startedAt, stars } = useProgress();

  const starString = '★'.repeat(stars) + '☆'.repeat(5 - stars);

  return (
    <ScreenShell
      artSrc="/art/mission-complete.webp"
      artAlt="Illustration of Dinesh Karthick concluding his mission in Palani"
      preTitle="THANK YOU FOR VISITING"
      title={['MISSION', 'COMPLETE']}
      subtitle="See you soon!"
      accentColor={ACCENT}
    >
      {/* Stats Card */}
      <div className="p-4 sm:p-5 lg:py-3 lg:px-4 rounded-lg bg-[rgba(10,10,14,0.85)] backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] my-1">
        <h2 className="font-['Barlow_Condensed'] font-bold text-sm lg:text-xs uppercase tracking-wider text-white border-b border-white/10 pb-2 mb-2.5">
          MISSION DEBRIEF & CAREER STATS
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-2.5 font-['Barlow_Condensed']">
          <div className="flex flex-col">
            <span className="text-xs text-[#b9b4ab] tracking-wider uppercase">XP EARNED</span>
            <span className="text-2xl lg:text-xl font-bold text-[#5fd068]">${xp.toLocaleString()}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-[#b9b4ab] tracking-wider uppercase">SECTIONS VISITED</span>
            <span className="text-2xl lg:text-xl font-bold text-white">
              {visited.size} / {TOTAL_SECTIONS}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-[#b9b4ab] tracking-wider uppercase">TIME PLAYED</span>
            <span className="text-2xl lg:text-xl font-bold text-[#38d6ff]">
              <TimePlayed startedAt={startedAt} />
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-[#b9b4ab] tracking-wider uppercase">RANK RATING</span>
            <span className="text-2xl lg:text-xl font-bold text-[#ffc23d] tracking-widest">{starString}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 mt-2">
        <PrimaryButton accentColor={ACCENT} onClick={() => navigate('/')}>
          BACK TO HOME
        </PrimaryButton>

        <button
          type="button"
          onClick={() => navigate('/contact')}
          className="px-6 py-2.5 sm:px-7 sm:py-3 rounded bg-white/10 hover:bg-white/20 text-white font-['Barlow_Condensed'] font-bold text-lg uppercase tracking-wider transition-colors cursor-pointer"
          style={{ transform: 'skewX(-6deg)' }}
        >
          <span className="inline-block" style={{ transform: 'skewX(6deg)' }}>
            CONTACT ME
          </span>
        </button>
      </div>
    </ScreenShell>
  );
};
