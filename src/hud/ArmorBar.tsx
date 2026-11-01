import React, { useState, useEffect } from 'react';
import { useProgress } from '../game/GameContext';

export const ArmorBar: React.FC = () => {
  const { startedAt } = useProgress();
  const [secondsOnSite, setSecondsOnSite] = useState<number>(() =>
    Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsOnSite(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    }, 1000);
    return () => clearInterval(timer);
  }, [startedAt]);

  const armorPercent = Math.min(100, Math.round((secondsOnSite / 180) * 100));

  return (
    <div className="flex-1 h-full bg-neutral-900 rounded-2xs overflow-hidden">
      <div
        className="h-full bg-[#38d6ff] transition-all duration-500"
        style={{ width: `${armorPercent}%` }}
        title={`Time On Site: ${armorPercent}% of 3 mins`}
      />
    </div>
  );
};
