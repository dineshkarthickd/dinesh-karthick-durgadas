import React, { useState, useEffect } from 'react';
import { useProgress, useUi } from '../game/GameContext';
import { loadoutProof } from '../data/loadoutProof';

export const AriaAnnouncer: React.FC = () => {
  const { missionPassed } = useProgress();
  const { equippedToast } = useUi();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (missionPassed) {
      const timer = setTimeout(() => {
        setAnnouncement(`Mission passed: ${missionPassed.section.toUpperCase()}`);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [missionPassed]);

  useEffect(() => {
    if (equippedToast) {
      const name = loadoutProof[equippedToast.tree]?.short || equippedToast.tree;
      const timer = setTimeout(() => {
        setAnnouncement(`${name.toUpperCase()} EQUIPPED`);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [equippedToast]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};
