import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, useReducedMotion } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import { useModal } from './useModal';
import type { Certificate } from '../data/portfolio';
import { useGameActions } from '../game/GameContext';
import { useHotkeys } from '../lib/inputLayer';
import { playMoveSound, playBackSound } from '../lib/sfx';
import { haptic } from '../lib/feedback';
import { useCertificateProtection } from './certificate/useCertificateProtection';
import { usePinchPan } from './certificate/usePinchPan';
import { AnnouncementBanner } from './certificate/AnnouncementBanner';
import { CertificateFrame } from './certificate/CertificateFrame';

interface CertificateViewerProps {
  certificates: Certificate[];
  initialIndex: number;
  onClose: () => void;
}

const CERT_MODULES = import.meta.glob('../assets/certs/*.webp', {
  query: '?url',
  import: 'default',
}) as Record<string, () => Promise<string>>;

function loadCertPreview(previewKey: string): Promise<string> {
  const matchPath = `../assets/certs/${previewKey}.webp`;
  const loader = CERT_MODULES[matchPath];
  if (!loader) {
    return Promise.reject(new Error(`Certificate preview not found: ${previewKey}`));
  }
  return loader();
}

export const CertificateViewer: React.FC<CertificateViewerProps> = ({
  certificates,
  initialIndex,
  onClose,
}) => {
  const prefersReduced = useReducedMotion();
  const { setCertViewerOpen } = useGameActions();
  const dialogCardRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Guard against empty certificates list
  const validIndex =
    certificates.length > 0
      ? Math.max(0, Math.min(certificates.length - 1, initialIndex))
      : 0;
  const [currentIndex, setCurrentIndex] = useState(validIndex);

  const [loadedImage, setLoadedImage] = useState<{
    key: string;
    src: string | null;
    error: boolean;
  }>({
    key: '',
    src: null,
    error: false,
  });

  const { isBlurred, setIsBlurred, toastMessage, setToastMessage } =
    useCertificateProtection();

  useModal({
    isOpen: true,
    containerRef: dialogCardRef,
    initialFocusRef: closeBtnRef,
    onClose,
  });

  // Block background navigation while modal is active
  useEffect(() => {
    setCertViewerOpen(true);
    return () => {
      setCertViewerOpen(false);
    };
  }, [setCertViewerOpen]);

  const currentCert = certificates[currentIndex] || certificates[0];

  const handlePrev = useCallback(() => {
    playMoveSound();
    haptic(10);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : certificates.length - 1));
  }, [certificates.length]);

  const handleNext = useCallback(() => {
    playMoveSound();
    haptic(10);
    setCurrentIndex((prev) => (prev < certificates.length - 1 ? prev + 1 : 0));
  }, [certificates.length]);

  const handleClose = useCallback(() => {
    playBackSound();
    haptic(10);
    onClose();
  }, [onClose]);

  const {
    isZoomed,
    panOffset,
    toggleZoom,
    resetZoom,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = usePinchPan({
    onPrev: handlePrev,
    onNext: handleNext,
  });

  // Reset zoom on index change
  useEffect(() => {
    resetZoom();
  }, [currentIndex, resetZoom]);

  // Load preview image dynamically; clear previous image while loading
  useEffect(() => {
    if (!currentCert) return;
    const previewKey = currentCert.preview;
    let active = true;

    loadCertPreview(previewKey)
      .then((url) => {
        if (active) {
          setLoadedImage({ key: previewKey, src: url, error: false });
        }
      })
      .catch(() => {
        if (active) {
          setLoadedImage({ key: previewKey, src: null, error: true });
        }
      });

    return () => {
      active = false;
    };
  }, [currentCert]);

  // Hotkey navigation on active layer 'certViewer'
  useHotkeys('certViewer', {
    Escape: (e) => {
      e.preventDefault();
      handleClose();
    },
    ArrowLeft: (e) => {
      e.preventDefault();
      handlePrev();
    },
    ArrowRight: (e) => {
      e.preventDefault();
      handleNext();
    },
    s: (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setToastMessage('Downloads are disabled — use VERIFY to check the original.');
      }
    },
    S: (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setToastMessage('Downloads are disabled — use VERIFY to check the original.');
      }
    },
    p: (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setToastMessage('Downloads are disabled — use VERIFY to check the original.');
      }
    },
    P: (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setToastMessage('Downloads are disabled — use VERIFY to check the original.');
      }
    },
  });

  const isLoading = loadedImage.key !== currentCert.preview && !loadedImage.error;
  const isError = loadedImage.key === currentCert.preview && loadedImage.error;
  const currentPreviewSrc =
    loadedImage.key === currentCert.preview ? loadedImage.src : null;

  if (typeof document === 'undefined' || certificates.length === 0 || !currentCert) return null;

  return createPortal(
    <div
      className="cert-viewer fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 lg:p-8 select-none"
      style={{
        backgroundColor: 'rgba(7, 6, 10, 0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        WebkitTouchCallout: 'none',
      }}
      onClick={handleClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Copy protection toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <div className="fixed top-6 z-[110] bg-[#0a0a0e]/95 border border-[#ff4d5e] text-white px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2.5 max-w-md mx-4 pointer-events-none">
            <AlertCircle className="text-[#ff4d5e] shrink-0" size={18} />
            <span className="font-['Barlow_Condensed'] font-semibold text-sm sm:text-base tracking-wide text-neutral-100">
              {toastMessage}
            </span>
          </div>
        )}
      </AnimatePresence>

      {/* GTA Announcement Stage 1 Banner on entry */}
      <AnnouncementBanner
        tier={currentCert.tier}
        prefersReduced={Boolean(prefersReduced)}
      />

      {/* Certificate Modal Card Frame */}
      <CertificateFrame
        currentCert={currentCert}
        currentIndex={currentIndex}
        totalCerts={certificates.length}
        isZoomed={isZoomed}
        panOffset={panOffset}
        isBlurred={isBlurred}
        previewSrc={currentPreviewSrc}
        isLoading={isLoading}
        isError={isError}
        onToggleZoom={toggleZoom}
        onClose={handleClose}
        onPrev={handlePrev}
        onNext={handleNext}
        onUnblur={() => setIsBlurred(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        dialogCardRef={dialogCardRef}
        closeBtnRef={closeBtnRef}
        prefersReduced={Boolean(prefersReduced)}
      />
    </div>,
    document.body
  );
};
