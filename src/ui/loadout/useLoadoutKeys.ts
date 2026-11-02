import { useEffect, useRef } from 'react';
import { useHotkeys } from '../../lib/inputLayer';
import { haptic } from '../../lib/feedback';
import { playMoveSound, playBackSound } from '../../lib/sfx';
import { skills } from '../../data/portfolio';

interface UseLoadoutKeysOptions {
  isOpen: boolean;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onEquipIndex: (index: number) => void;
  onClose: () => void;
  wheelContainerRef: React.RefObject<HTMLElement | null>;
}

export function useLoadoutKeys({
  isOpen,
  selectedIndex,
  onSelectIndex,
  onEquipIndex,
  onClose,
  wheelContainerRef,
}: UseLoadoutKeysOptions) {
  const lastWheelTimeRef = useRef<number>(0);

  // Keyboard navigation on input layer 'loadout'
  useHotkeys(
    'loadout',
    {
      Escape: (e) => {
        e.preventDefault();
        haptic(10);
        playBackSound();
        onClose();
      },
      ArrowRight: (e) => {
        e.preventDefault();
        playMoveSound();
        onSelectIndex((selectedIndex + 1) % skills.length);
      },
      ArrowDown: (e) => {
        e.preventDefault();
        playMoveSound();
        onSelectIndex((selectedIndex + 1) % skills.length);
      },
      KeyD: (e) => {
        e.preventDefault();
        playMoveSound();
        onSelectIndex((selectedIndex + 1) % skills.length);
      },
      d: (e) => {
        e.preventDefault();
        playMoveSound();
        onSelectIndex((selectedIndex + 1) % skills.length);
      },
      ArrowLeft: (e) => {
        e.preventDefault();
        playMoveSound();
        onSelectIndex((selectedIndex - 1 + skills.length) % skills.length);
      },
      ArrowUp: (e) => {
        e.preventDefault();
        playMoveSound();
        onSelectIndex((selectedIndex - 1 + skills.length) % skills.length);
      },
      KeyA: (e) => {
        e.preventDefault();
        playMoveSound();
        onSelectIndex((selectedIndex - 1 + skills.length) % skills.length);
      },
      a: (e) => {
        e.preventDefault();
        playMoveSound();
        onSelectIndex((selectedIndex - 1 + skills.length) % skills.length);
      },
      Enter: (e) => {
        e.preventDefault();
        onEquipIndex(selectedIndex);
        onClose();
      },
    },
    isOpen
  );

  // Wheel listener attached ONLY to desktop wheelContainerRef
  useEffect(() => {
    const el = wheelContainerRef.current;
    if (!el || !isOpen) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTimeRef.current < 90) return;
      lastWheelTimeRef.current = now;
      playMoveSound();
      if (e.deltaY > 0) {
        onSelectIndex((selectedIndex + 1) % skills.length);
      } else if (e.deltaY < 0) {
        onSelectIndex((selectedIndex - 1 + skills.length) % skills.length);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [isOpen, selectedIndex, onSelectIndex, wheelContainerRef]);
}
