import React from 'react';

interface InfoCardProps {
  label: string;
  value: string;
  accentColor: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  label,
  value,
  accentColor,
  icon,
  className = '',
  onClick,
}) => {
  const content = (
    <>
      {icon && (
        <div
          className="w-[var(--m-card-icon-box)] h-[var(--m-card-icon-box)] lg:w-8 lg:h-8 rounded flex items-center justify-center shrink-0 text-black shadow-md [&>svg]:w-[var(--m-card-icon-glyph)] [&>svg]:h-[var(--m-card-icon-glyph)] lg:[&>svg]:w-4 lg:[&>svg]:h-4"
          style={{ backgroundColor: accentColor }}
        >
          {icon}
        </div>
      )}

      <div className="flex flex-col min-w-0">
        <span className="font-['Barlow_Condensed'] font-bold card-title-mobile lg:text-[13px] uppercase tracking-wider text-white/90 leading-tight">
          {label}
        </span>
        <span className="font-['Inter'] card-text-mobile lg:text-[14px] text-[#b9b4ab] mt-0.5 leading-snug break-words">
          {value}
        </span>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`text-left w-full group relative flex items-center gap-3.5 sm:gap-4 p-[var(--m-card-pad)] lg:py-3.5 lg:px-4 rounded-r-lg bg-[rgba(10,10,14,0.72)] backdrop-blur-md border border-white/10 transition-all duration-200 hover:translate-x-1.5 hover:border-white/30 cursor-pointer ${className}`}
        style={{
          borderLeft: `4px solid ${accentColor}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={`group relative flex items-center gap-3.5 sm:gap-4 p-[var(--m-card-pad)] lg:py-3.5 lg:px-4 rounded-r-lg bg-[rgba(10,10,14,0.72)] backdrop-blur-md border border-white/10 transition-all duration-200 hover:translate-x-1.5 hover:border-white/30 ${className}`}
      style={{
        borderLeft: `4px solid ${accentColor}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      {content}
    </div>
  );
};
