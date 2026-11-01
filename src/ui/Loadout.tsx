import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useModal } from './useModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Volume2, VolumeX } from 'lucide-react';
import { skills, type SkillTree } from '../data/portfolio';
import { useUi, useGameActions } from '../game/GameContext';
import { activeLoadoutSelectionRef } from '../lib/loadoutSelection';
import { haptic } from '../lib/feedback';
import {
  isSfxEnabled,
  toggleSfx,
  subscribeSfx,
  playBackSound,
} from '../lib/sfx';
import { LoadoutWheel } from './loadout/LoadoutWheel';
import { LoadoutSheet } from './loadout/LoadoutSheet';
import { useLoadoutKeys } from './loadout/useLoadoutKeys';

export const Loadout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadoutOpen, equipped } = useUi();
  const { setLoadoutOpen, equipTree } = useGameActions();

  const [loadoutSelectedTree, setLoadoutSelectedTreeState] = useState<SkillTree>(
    () => equipped || activeLoadoutSelectionRef.current || skills[0]?.tree || 'Frontend'
  );

  const setLoadoutSelectedTree = useCallback((tree: SkillTree) => {
    activeLoadoutSelectionRef.current = tree;
    setLoadoutSelectedTreeState(tree);
  }, []);

  const selectedIndex = useMemo(() => {
    const idx = skills.findIndex((s) => s.tree === loadoutSelectedTree);
    return idx >= 0 ? idx : 0;
  }, [loadoutSelectedTree]);

  const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(0);
  const wheelContainerRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const [prevLoadoutOpen, setPrevLoadoutOpen] = useState(loadoutOpen);
  if (loadoutOpen !== prevLoadoutOpen) {
    setPrevLoadoutOpen(loadoutOpen);
    if (loadoutOpen) {
      const tree = equipped || activeLoadoutSelectionRef.current || skills[0]?.tree || 'Frontend';
      setLoadoutSelectedTreeState(tree);
      const idx = skills.findIndex((s) => s.tree === tree);
      setMobileExpandedIndex(idx >= 0 ? idx : 0);
    }
  }

  const handleClose = useCallback(() => {
    haptic(10);
    playBackSound();
    setLoadoutOpen(false);
  }, [setLoadoutOpen]);

  useModal({
    isOpen: loadoutOpen,
    containerRef: dialogRef,
    initialFocusRef: closeButtonRef,
    onClose: handleClose,
  });

  // Close the wheel on route change
  useEffect(() => {
    if (loadoutOpen) {
      setLoadoutOpen(false);
    }
  }, [location.pathname, loadoutOpen, setLoadoutOpen]);

  // SFX state subscription
  const [sfxOn, setSfxOn] = useState<boolean>(isSfxEnabled());
  useEffect(() => {
    return subscribeSfx(setSfxOn);
  }, []);

  // Compute radius on resize: min(32vh, 300px)
  const [radius, setRadius] = useState<number>(() =>
    typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.32, 300) : 260
  );

  useEffect(() => {
    const updateRadius = () => {
      setRadius(Math.min(window.innerHeight * 0.32, 300));
    };
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  const handleSelectIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < skills.length) {
        setLoadoutSelectedTree(skills[index].tree);
        setMobileExpandedIndex(index);
      }
    },
    [setLoadoutSelectedTree]
  );

  const handleEquipIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < skills.length) {
        equipTree(skills[index].tree);
      }
    },
    [equipTree]
  );

  useLoadoutKeys({
    isOpen: loadoutOpen,
    selectedIndex,
    onSelectIndex: handleSelectIndex,
    onEquipIndex: handleEquipIndex,
    onClose: handleClose,
    wheelContainerRef,
  });

  const handleNavProject = (pid: string) => {
    haptic(10);
    setLoadoutOpen(false);
    navigate(`/projects?open=${encodeURIComponent(pid)}`);
  };

  const handleNavJob = () => {
    haptic(10);
    setLoadoutOpen(false);
    navigate('/experience');
  };

  const handleNavCerts = (tree: string) => {
    haptic(10);
    setLoadoutOpen(false);
    navigate(`/achievements?skill=${encodeURIComponent(tree)}`);
  };

  const modalContent = (
    <AnimatePresence>
      {loadoutOpen && (
        <motion.div
          key="loadout-modal"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Skill Trees Loadout Wheel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          {/* Top Bar with SFX & Close */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-3 pointer-events-auto">
            <button
              type="button"
              onClick={toggleSfx}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                sfxOn
                  ? 'border-white/20 bg-black/60 text-[#5fd068]'
                  : 'border-white/10 bg-black/40 text-[#b9b4ab]'
              }`}
              title="Toggle sound effects"
            >
              {sfxOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              className="p-2 rounded-full border border-white/20 bg-black/60 hover:bg-[#ff2e88] text-white hover:border-[#ff2e88] transition-colors cursor-pointer"
              title="Close Loadout (ESC)"
              aria-label="Close loadout"
            >
              <X size={18} />
            </button>
          </div>

          {/* Desktop Wheel View */}
          <div
            className="hidden lg:flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <LoadoutWheel
              radius={radius}
              selectedIndex={selectedIndex}
              onSelectIndex={handleSelectIndex}
              onEquipIndex={(idx) => {
                handleEquipIndex(idx);
                setLoadoutOpen(false);
              }}
              isCurrentEquipped={equipped === skills[selectedIndex]?.tree}
              onNavProject={handleNavProject}
              onNavJob={handleNavJob}
              onNavCerts={handleNavCerts}
              wheelContainerRef={wheelContainerRef}
            />
          </div>

          {/* Mobile Bottom Sheet View */}
          <div
            className="lg:hidden fixed inset-x-0 bottom-0 top-16 bg-[#07060a] border-t border-white/15 rounded-t-2xl flex flex-col overflow-hidden cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="font-['Anton'] text-2xl uppercase tracking-wider text-white">
                  SKILL TREES
                </h2>
                <p className="font-['Barlow_Condensed'] text-xs text-[#b9b4ab] uppercase tracking-wider">
                  Equip a tree to filter projects & certificates
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-full border border-white/20 bg-black/60 hover:bg-[#ff2e88] text-white hover:border-[#ff2e88] transition-colors cursor-pointer shrink-0"
                title="Close Loadout"
                aria-label="Close loadout"
              >
                <X size={18} />
              </button>
            </div>

            <LoadoutSheet
              selectedIndex={selectedIndex}
              expandedIndex={mobileExpandedIndex}
              onToggleExpand={(idx) => {
                setMobileExpandedIndex(mobileExpandedIndex === idx ? null : idx);
                if (idx >= 0 && idx < skills.length) {
                  setLoadoutSelectedTree(skills[idx].tree);
                }
              }}
              onEquipIndex={(idx) => {
                handleEquipIndex(idx);
                setLoadoutOpen(false);
              }}
              equippedTree={equipped}
              onNavProject={handleNavProject}
              onNavJob={handleNavJob}
              onNavCerts={handleNavCerts}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
};

export default Loadout;
