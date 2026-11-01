import React, { useState, useEffect } from 'react';
import { graduationDate } from '../data/portfolio';

export const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  }>({
    days: '000',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const target = new Date(graduationDate).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(3, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 select-none pointer-events-auto">
      <span className="font-['Barlow_Condensed'] uppercase tracking-[0.16em] text-[10px] text-[#b9b4ab] font-bold whitespace-nowrap">
        MCA GRADUATION IN
      </span>
      <div
        className="font-['Barlow_Condensed'] font-bold text-[16px] text-white tracking-widest leading-none whitespace-nowrap"
        style={{ textShadow: '1px 1px 0 #000, 0 0 6px rgba(0,0,0,0.8)' }}
      >
        {timeLeft.days}D : {timeLeft.hours}H : {timeLeft.minutes}M : {timeLeft.seconds}S
      </div>
    </div>
  );
};
