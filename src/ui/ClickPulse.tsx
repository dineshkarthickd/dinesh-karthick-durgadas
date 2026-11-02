import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

interface PulseState {
  x: number;
  y: number;
  key: number;
}

export const ClickPulse: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [pulse, setPulse] = useState<PulseState | null>(null);
  const countRef = useRef<number>(0);

  useEffect(() => {
    if (prefersReduced) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      countRef.current += 1;
      setPulse({ x: e.clientX, y: e.clientY, key: countRef.current });
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [prefersReduced]);

  if (prefersReduced || !pulse) return null;

  return (
    <div
      key={pulse.key}
      className="fixed pointer-events-none rounded-full border-2 border-vice-pink z-[9999] animate-click-pulse"
      style={{
        left: pulse.x,
        top: pulse.y,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};
