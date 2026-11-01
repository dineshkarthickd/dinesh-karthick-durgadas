import React from 'react';
import { useModal, type UseModalOptions } from './useModal';

export interface ModalProps extends UseModalOptions {
  children: React.ReactNode;
  className?: string;
  titleId?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  containerRef,
  initialFocusRef,
  onClose,
  titleId,
  className,
  children,
}) => {
  useModal({ isOpen, containerRef, initialFocusRef, onClose });

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={className}
    >
      {children}
    </div>
  );
};
