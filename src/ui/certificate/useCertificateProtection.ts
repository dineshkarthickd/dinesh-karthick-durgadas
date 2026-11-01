import { useState, useEffect } from 'react';

interface UseCertificateProtectionResult {
  isBlurred: boolean;
  setIsBlurred: (blurred: boolean) => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

export function useCertificateProtection(): UseCertificateProtectionResult {
  const [isBlurred, setIsBlurred] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Capture protection: PrintScreen keyup, window blur, and visibilitychange (unblur on overlay click)
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        setIsBlurred(true);
        try {
          navigator.clipboard.writeText('');
        } catch {
          // Ignore clipboard permission errors
        }
      }
    };

    const handleWindowBlur = () => {
      setIsBlurred(true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsBlurred(true);
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Auto-dismiss toast after 3.2 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return {
    isBlurred,
    setIsBlurred,
    toastMessage,
    setToastMessage,
  };
}
