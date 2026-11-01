/**
 * useModal.ts
 *
 * Implements accessible dialog semantics and keyboard focus handling:
 * - Traps Tab / Shift+Tab within the modal container.
 * - Saves document.activeElement before opening and restores it on close.
 * - Sets `inert` on the #root app container behind the modal while open.
 * - Focuses initial element (close button) on open.
 */

import { useEffect, useRef } from 'react';

let inertModalCount = 0;

export function setRootInert(inert: boolean) {
  if (typeof document === 'undefined') return;
  const root = document.getElementById('root');
  if (!root) return;

  if (inert) {
    inertModalCount++;
    if (inertModalCount === 1) {
      root.setAttribute('inert', '');
    }
  } else {
    inertModalCount = Math.max(0, inertModalCount - 1);
    if (inertModalCount === 0) {
      root.removeAttribute('inert');
    }
  }
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface UseModalOptions {
  isOpen: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  onClose?: () => void;
}

export function useModal({
  isOpen,
  containerRef,
  initialFocusRef,
  returnFocusRef,
  onClose,
}: UseModalOptions) {
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    // Capture the previously focused element once when modal opens
    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Mark background as inert
    setRootInert(true);

    // Focus close button or first focusable control after animation starts
    const focusTimer = requestAnimationFrame(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }
      const container = containerRef.current;
      if (container) {
        const closeBtn = container.querySelector<HTMLElement>(
          'button[aria-label*="close" i], button[title*="close" i]'
        );
        if (closeBtn) {
          closeBtn.focus();
          return;
        }
        const first = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        first?.focus();
      }
    });

    // Handle Tab key trapping
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const container = containerRef.current;
        if (!container) return;

        const focusables = Array.from(
          container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !container.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !container.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const returnFocusEl = returnFocusRef?.current;

    return () => {
      cancelAnimationFrame(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      setRootInert(false);

      // Restore focus on close
      const prev = previousActiveElementRef.current;
      const retRef = returnFocusEl;

      setTimeout(() => {
        if (prev && document.body.contains(prev) && typeof prev.focus === 'function') {
          prev.focus();
        } else if (retRef && document.body.contains(retRef) && typeof retRef.focus === 'function') {
          retRef.focus();
        } else {
          const main = document.querySelector<HTMLElement>('main');
          if (main && typeof main.focus === 'function') {
            main.focus();
          }
        }
      }, 0);
    };
  }, [isOpen, containerRef, initialFocusRef, returnFocusRef]);
}
