import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { GameProvider } from './game/GameProvider';
import { useUi, useGameActions } from './game/GameContext';
import { activeLoadoutSelectionRef } from './lib/loadoutSelection';
import { Hud } from './hud/Hud';
import { AreaName } from './ui/AreaName';
import { MissionPassed } from './ui/MissionPassed';
import { EquippedToast } from './ui/EquippedToast';
import { AriaAnnouncer } from './ui/AriaAnnouncer';
import { ClickPulse } from './ui/ClickPulse';
import { BackgroundStage } from './ui/BackgroundStage';
import { Boot } from './screens/Boot';
import { getActiveLayer } from './lib/inputLayer';
import { playSelectSound, playBackSound } from './lib/sfx';

// Lazy-load overlays & route screens to keep entry chunk small (<300 KB)
const Loadout = lazy(() => import('./ui/Loadout').then((m) => ({ default: m.Loadout })));

// Lazy-load route screens to eliminate the bundle size warning and optimize performance
const Menu = lazy(() => import('./screens/Menu').then((m) => ({ default: m.Menu })));
const About = lazy(() => import('./screens/About').then((m) => ({ default: m.About })));
const Skills = lazy(() => import('./screens/Skills').then((m) => ({ default: m.Skills })));
const Projects = lazy(() => import('./screens/Projects').then((m) => ({ default: m.Projects })));
const Experience = lazy(() => import('./screens/Experience').then((m) => ({ default: m.Experience })));
const Achievements = lazy(() => import('./screens/Achievements').then((m) => ({ default: m.Achievements })));
const Academy = lazy(() => import('./screens/Academy').then((m) => ({ default: m.Academy })));
const Contact = lazy(() => import('./screens/Contact').then((m) => ({ default: m.Contact })));
const MissionComplete = lazy(() => import('./screens/MissionComplete').then((m) => ({ default: m.MissionComplete })));

const BOOT_SESSION_KEY = 'dk_portfolio_has_booted';

const MainLayout: React.FC = () => {
  const location = useLocation();

  return (
    <>
      {/* Persistent Living Background Stage: cross-dissolves directly without black cuts */}
      <BackgroundStage />

      {/* Fixed HUD stays mounted across all routes without flickering */}
      <Hud />

      {/* Dynamic Popups & Overlays */}
      <AreaName />
      <MissionPassed />
      <Suspense fallback={null}>
        <Loadout />
      </Suspense>
      <EquippedToast />
      <AriaAnnouncer />
      <ClickPulse />

      {/* Screen Routes with popLayout: outgoing content fades out (200ms) while new content starts */}
      <Suspense fallback={null}>
        <AnimatePresence mode="popLayout">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/mission-complete" element={<MissionComplete />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  );
};

const AppContent: React.FC = () => {
  const { loadoutOpen } = useUi();
  const { setLoadoutOpen, equipTree } = useGameActions();
  const [booted, setBooted] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(BOOT_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const handleBootComplete = useCallback(() => {
    try {
      sessionStorage.setItem(BOOT_SESSION_KEY, 'true');
    } catch {
      // ignore
    }
    setBooted(true);
  }, []);

  // Global Q shortcut: Hold Q (>250ms) to aim + release to equip; Quick Q tap toggles
  const qDownTimestampRef = useRef<number | null>(null);
  const qOpenedByPressRef = useRef<boolean>(false);
  const loadoutOpenRef = useRef<boolean>(loadoutOpen);

  useEffect(() => {
    loadoutOpenRef.current = loadoutOpen;
  }, [loadoutOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Q') {
        if (e.repeat) return;
        const activeLayer = getActiveLayer();
        if (activeLayer === 'certViewer' || activeLayer === 'briefing') return;
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          (e.target instanceof HTMLElement && e.target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        if (qDownTimestampRef.current === null) {
          qDownTimestampRef.current = Date.now();
          qOpenedByPressRef.current = !loadoutOpenRef.current;
          if (!loadoutOpenRef.current) {
            setLoadoutOpen(true);
            playSelectSound();
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Q') {
        const activeLayer = getActiveLayer();
        if (activeLayer === 'certViewer' || activeLayer === 'briefing') return;
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          (e.target instanceof HTMLElement && e.target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        if (qDownTimestampRef.current !== null) {
          const duration = Date.now() - qDownTimestampRef.current;
          const wasOpenedByThisPress = qOpenedByPressRef.current;
          qDownTimestampRef.current = null;

          if (duration > 250) {
            // Held Q > 250ms: equip selected tree and close wheel
            equipTree(activeLoadoutSelectionRef.current);
            setLoadoutOpen(false);
          } else {
            // Quick Q tap: toggle open/closed without equipping
            if (!wasOpenedByThisPress) {
              // Was already open before -> quick tap closes it
              setLoadoutOpen(false);
              playBackSound();
            }
          }
        }
      }
    };

    const handleBlur = () => {
      qDownTimestampRef.current = null;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [setLoadoutOpen, equipTree]);

  if (!booted) {
    return <Boot onComplete={handleBootComplete} />;
  }

  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
};

export const App: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <GameProvider>
        <AppContent />
      </GameProvider>
    </MotionConfig>
  );
};

export default App;
