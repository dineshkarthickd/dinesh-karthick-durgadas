import React, {
  useState,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import { haptic } from '../lib/feedback';
import { playSelectSound } from '../lib/sfx';
import { activeLoadoutSelectionRef } from '../lib/loadoutSelection';
import { ALL_SECTION_IDS, TOTAL_SECTIONS } from '../data/routes';
import { skills, type SkillTree } from '../data/portfolio';
import {
  type SectionId,
  type StoredData,
  type ProgressState,
  type ProgressAction,
  type UiContextType,
  type ActionsContextType,
  ProgressContext,
  UiContext,
  ActionsContext,
} from './GameContext';

const STORAGE_KEY = 'dk_portfolio_game_state_v1';
const EQUIPPED_KEY = 'dk_equipped';
const FIRST_EQUIP_KEY = 'dk_has_ever_equipped';

const VALID_TREES = new Set<string>(skills.map((s) => s.tree));

function loadInitialState(): StoredData {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const validVisited = Array.isArray(parsed.visited)
        ? parsed.visited.filter((s: unknown): s is SectionId =>
            typeof s === 'string' && (ALL_SECTION_IDS as readonly string[]).includes(s)
          )
        : [];
      return {
        visited: validVisited,
        xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
        startedAt: typeof parsed.startedAt === 'number' ? parsed.startedAt : Date.now(),
        missionCompleteShown: Boolean(parsed.missionCompleteShown),
      };
    }
  } catch (e) {
    console.warn('SessionStorage unavailable', e);
  }
  return {
    visited: [],
    xp: 0,
    startedAt: Date.now(),
    missionCompleteShown: false,
  };
}

function progressReducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case 'MARK_VISITED': {
      if (state.visited.has(action.section)) {
        return state;
      }
      const nextVisited = new Set(state.visited);
      nextVisited.add(action.section);
      const nextXp = state.xp + 100;
      const nextStars = Math.min(5, Math.ceil((nextVisited.size * 5) / TOTAL_SECTIONS));
      const now = Date.now();
      return {
        ...state,
        visited: nextVisited,
        xp: nextXp,
        xpDelta: { amount: 100, key: now },
        stars: nextStars,
        missionPassed: { section: action.section, key: now },
      };
    }
    case 'TICK_XP': {
      return {
        ...state,
        xp: state.xp + 10,
        xpDelta: { amount: 10, key: Date.now() },
      };
    }
    case 'BONUS_XP': {
      return {
        ...state,
        xp: state.xp + action.amount,
        xpDelta: { amount: action.amount, key: Date.now() },
      };
    }
    case 'SET_MISSION_COMPLETE_SHOWN': {
      if (state.missionCompleteShown === action.shown) return state;
      const nextXp = action.shown ? state.xp + 1000 : state.xp;
      return {
        ...state,
        xp: nextXp,
        xpDelta: action.shown ? { amount: 1000, key: Date.now() } : state.xpDelta,
        missionCompleteShown: action.shown,
      };
    }
    default:
      return state;
  }
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initial] = useState(loadInitialState);

  const [progressState, dispatch] = useReducer(progressReducer, initial, (init) => {
    const visitedSet = new Set<SectionId>(init.visited);
    return {
      visited: visitedSet,
      xp: init.xp,
      xpDelta: null,
      stars: visitedSet.size === 0 ? 0 : Math.min(5, Math.ceil((visitedSet.size * 5) / TOTAL_SECTIONS)),
      startedAt: init.startedAt,
      missionPassed: null,
      missionCompleteShown: init.missionCompleteShown,
    };
  });

  // UI state
  const [loadoutOpen, setLoadoutOpen] = useState<boolean>(false);
  const [certViewerOpen, setCertViewerOpen] = useState<boolean>(false);
  const [equipped, setEquippedState] = useState<SkillTree | null>(() => {
    try {
      const stored = sessionStorage.getItem(EQUIPPED_KEY);
      return stored && VALID_TREES.has(stored) ? (stored as SkillTree) : null;
    } catch {
      return null;
    }
  });
  const [equippedToast, setEquippedToast] = useState<{ tree: SkillTree; key: number } | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const unequipTree = useCallback(() => {
    setEquippedState(null);
    try {
      sessionStorage.removeItem(EQUIPPED_KEY);
    } catch {
      // ignore
    }
  }, []);

  const equipTree = useCallback((tree: SkillTree) => {
    setEquippedState(tree);
    activeLoadoutSelectionRef.current = tree;
    try {
      sessionStorage.setItem(EQUIPPED_KEY, tree);
    } catch {
      // ignore
    }

    // Audio & Haptic feedback
    playSelectSound();
    haptic([10, 30, 10]);

    // First equip ever awards +$500
    try {
      const hasEverEquipped = sessionStorage.getItem(FIRST_EQUIP_KEY);
      if (!hasEverEquipped) {
        sessionStorage.setItem(FIRST_EQUIP_KEY, 'true');
        dispatch({ type: 'BONUS_XP', amount: 500 });
      }
    } catch {
      // ignore
    }

    // 1.5s bottom-center toast
    const toastKey = Date.now();
    setEquippedToast({ tree, key: toastKey });
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setEquippedToast((curr) => (curr?.key === toastKey ? null : curr));
    }, 1500);
  }, []);

  const toggleLoadout = useCallback(() => {
    setLoadoutOpen((prev) => !prev);
  }, []);

  const markVisited = useCallback((section: SectionId) => {
    dispatch({ type: 'MARK_VISITED', section });
  }, []);

  const awardMissionComplete = useCallback(() => {
    dispatch({ type: 'SET_MISSION_COMPLETE_SHOWN', shown: true });
  }, []);

  // Save state to sessionStorage
  useEffect(() => {
    try {
      const data: StoredData = {
        visited: Array.from(progressState.visited),
        xp: progressState.xp,
        startedAt: progressState.startedAt,
        missionCompleteShown: progressState.missionCompleteShown,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [
    progressState.visited,
    progressState.xp,
    progressState.startedAt,
    progressState.missionCompleteShown,
  ]);

  // +10 XP every 15 seconds tab is visible
  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        dispatch({ type: 'TICK_XP' });
      }
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  const uiValue = useMemo<UiContextType>(
    () => ({
      loadoutOpen,
      certViewerOpen,
      equipped,
      equippedToast,
    }),
    [loadoutOpen, certViewerOpen, equipped, equippedToast]
  );

  const actionsValue = useMemo<ActionsContextType>(
    () => ({
      setLoadoutOpen,
      toggleLoadout,
      setCertViewerOpen,
      markVisited,
      equipTree,
      unequipTree,
      awardMissionComplete,
      loadoutSelectedTree: activeLoadoutSelectionRef.current,
      setLoadoutSelectedTree: (tree: SkillTree) => {
        activeLoadoutSelectionRef.current = tree;
      },
    }),
    [
      setLoadoutOpen,
      toggleLoadout,
      setCertViewerOpen,
      markVisited,
      equipTree,
      unequipTree,
      awardMissionComplete,
    ]
  );

  return (
    <ProgressContext.Provider value={progressState}>
      <UiContext.Provider value={uiValue}>
        <ActionsContext.Provider value={actionsValue}>{children}</ActionsContext.Provider>
      </UiContext.Provider>
    </ProgressContext.Provider>
  );
};
