import React from 'react';
import { haptic } from '../lib/feedback';
import { playSelectSound } from '../lib/sfx';

interface PrimaryButtonProps {
  children: React.ReactNode;
  accentColor?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  accentColor = '#ff2e88',
  onClick,
  href,
  target,
  rel,
  disabled = false,
  className = '',
  type = 'button',
}) => {
  const content = (
    <div className="flex items-center gap-2 font-['Barlow_Condensed'] font-bold text-lg sm:text-xl uppercase tracking-wider text-black select-none">
      <span style={{ transform: 'skewX(6deg)' }}>{children}</span>
      <span
        className="transition-transform duration-200 group-hover:translate-x-1.5 text-xl font-bold"
        style={{ transform: 'skewX(6deg)' }}
      >
        ›
      </span>
    </div>
  );

  const baseClasses = `
    group relative inline-flex items-center justify-center px-6 py-2.5 sm:px-7 sm:py-3 cursor-pointer
    transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
    shadow-[0_4px_16px_rgba(0,0,0,0.6)] hover:brightness-110 hover:shadow-[0_6px_24px_rgba(0,0,0,0.8)]
    ${className}
  `;

  const handleClick = () => {
    if (disabled) return;
    haptic(10);
    playSelectSound();
    onClick?.();
  };

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={handleClick}
        className={baseClasses}
        style={{
          backgroundColor: accentColor,
          transform: 'skewX(-6deg)',
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={baseClasses}
      style={{
        backgroundColor: accentColor,
        transform: 'skewX(-6deg)',
      }}
    >
      {content}
    </button>
  );
};
