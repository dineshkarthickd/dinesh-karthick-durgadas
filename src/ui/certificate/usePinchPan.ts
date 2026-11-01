import { useState, useRef, useCallback } from 'react';
import { haptic } from '../../lib/feedback';

interface UsePinchPanOptions {
  onPrev: () => void;
  onNext: () => void;
}

export function usePinchPan({ onPrev, onNext }: UsePinchPanOptions) {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; originX: number; originY: number } | null>(null);

  const toggleZoom = useCallback(() => {
    haptic(10);
    setIsZoomed((prev) => {
      if (prev) {
        setPanOffset({ x: 0, y: 0 });
        return false;
      }
      return true;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setIsZoomed(false);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const now = Date.now();

    if (touchStartRef.current && now - touchStartRef.current.time < 300) {
      // Double tap detected
      toggleZoom();
      touchStartRef.current = null;
      return;
    }

    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: now };

    if (isZoomed) {
      isDraggingRef.current = true;
      dragStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        originX: panOffset.x,
        originY: panOffset.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isZoomed && isDraggingRef.current && dragStartRef.current) {
      const touch = e.touches[0];
      const dx = touch.clientX - dragStartRef.current.x;
      const dy = touch.clientY - dragStartRef.current.y;
      setPanOffset({
        x: Math.max(-250, Math.min(250, dragStartRef.current.originX + dx)),
        y: Math.max(-180, Math.min(180, dragStartRef.current.originY + dy)),
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isZoomed) {
      isDraggingRef.current = false;
      dragStartRef.current = null;
      return;
    }

    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    // Horizontal swipe threshold: 50px dx and more horizontal than vertical
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx > 0) {
        onPrev();
      } else {
        onNext();
      }
    }
  };

  return {
    isZoomed,
    panOffset,
    toggleZoom,
    resetZoom,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
