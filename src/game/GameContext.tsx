// oxlint-disable react/only-export-components -- GameContext exports React contexts and custom hooks for application state
import { createContext, useContext } from 'react';
import type { SkillTree } from '../data/portfolio';
import { ALL_SECTION_IDS } from '../data/routes';

export type SectionId = typeof ALL_SECTION_IDS[number];
export const ALL_SECTIONS = ALL_SECTION_IDS as readonly SectionId[];

export interface XpDelta {
  amount: number;
  key: number;
}

export interface MissionPassedEvent {
  section: SectionId;
  key: number;
}

export interface StoredData {
  visited: SectionId[];
  xp: number;
  startedAt: number;
  missionCompleteShown: boolean;
}

export interface ProgressState {
  visited: Set<SectionId>;
  xp: number;
  xpDelta: XpDelta | null;
  stars: number;
  startedAt: number;
  missionPassed: MissionPassedEvent | null;
  missionCompleteShown: boolean;
}

export type ProgressAction =
  | { type: 'TICK_XP' }
  | { type: 'BONUS_XP'; amount: number }
  | { type: 'MARK_VISITED'; section: SectionId }
  | { type: 'SET_MISSION_COMPLETE_SHOWN'; shown: boolean };

export interface ProgressContextType {
  visited: Set<SectionId>;
  xp: number;
  xpDelta: XpDelta | null;
  stars: number;
  startedAt: number;
  missionPassed: MissionPassedEvent | null;
  missionCompleteShown: boolean;
}

export interface UiContextType {
  loadoutOpen: boolean;
  certViewerOpen: boolean;
  equipped: SkillTree | null;
  equippedToast: { tree: SkillTree; key: number } | null;
}

export interface ActionsContextType {
  setLoadoutOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleLoadout: () => void;
  setCertViewerOpen: (open: boolean) => void;
  markVisited: (section: SectionId) => void;
  equipTree: (tree: SkillTree) => void;
  unequipTree: () => void;
  awardMissionComplete: () => void;
  loadoutSelectedTree?: SkillTree;
  setLoadoutSelectedTree?: (tree: SkillTree) => void;
}

export const ProgressContext = createContext<ProgressContextType | undefined>(undefined);
export const UiContext = createContext<UiContextType | undefined>(undefined);
export const ActionsContext = createContext<ActionsContextType | undefined>(undefined);

export function useProgress(): ProgressContextType {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a GameProvider');
  }
  return context;
}

export function useUi(): UiContextType {
  const context = useContext(UiContext);
  if (!context) {
    throw new Error('useUi must be used within a GameProvider');
  }
  return context;
}

export function useGameActions(): ActionsContextType {
  const context = useContext(ActionsContext);
  if (!context) {
    throw new Error('useGameActions must be used within a GameProvider');
  }
  return context;
}

export function useGame() {
  const progress = useProgress();
  const ui = useUi();
  const actions = useGameActions();
  return { ...progress, ...ui, ...actions };
}

export { GameProvider } from './GameProvider';

