import React from 'react';
import { Check } from 'lucide-react';

interface EquipButtonProps {
  isEquipped: boolean;
  onEquip: () => void;
  className?: string;
}

export const EquipButton: React.FC<EquipButtonProps> = ({
  isEquipped,
  onEquip,
  className = '',
}) => {
  if (isEquipped) {
    return (
      <div
        className={`w-full py-1.5 px-3 rounded flex items-center justify-center gap-1.5 border border-[#5fd068]/50 bg-[#5fd068]/15 text-[#5fd068] font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider ${className}`}
      >
        <Check size={14} />
        <span>EQUIPPED</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onEquip}
      className={`w-full py-2 px-3 rounded flex items-center justify-center gap-1.5 bg-gradient-to-r from-vice-pink to-vice-cyan hover:brightness-110 text-white font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-[1.02] ${className}`}
      style={{ transform: 'skewX(-6deg)' }}
    >
      <span className="inline-block" style={{ transform: 'skewX(6deg)' }}>
        EQUIP TREE (ENTER)
      </span>
    </button>
  );
};
