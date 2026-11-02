import { useEffect, useRef, type RefObject } from 'react';
import Lenis from 'lenis';

export function useSmoothScroll(
  wrapperRef: RefObject<HTMLElement | null>,
  enabled = true
) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Check prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    // Safety check: only attach Lenis if wrapper is an actual scroll container
    if (typeof window !== 'undefined') {
      const computedOverflowY = window.getComputedStyle(wrapper).overflowY;
      if (computedOverflowY !== 'auto' && computedOverflowY !== 'scroll') {
        if (import.meta.env.DEV) {
          console.warn(
            '[useSmoothScroll] Wrapper is not a scroll container (computed overflow-y is not auto or scroll):',
            wrapper
          );
        }
        return;
      }
    }

    const lenis = new Lenis({
      wrapper,
      content: wrapper,
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    resizeObserver.observe(wrapper);
    if (wrapper.firstElementChild) {
      resizeObserver.observe(wrapper.firstElementChild);
    }

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [wrapperRef, enabled]);

  return lenisRef;
}
