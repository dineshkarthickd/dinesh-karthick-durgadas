/**
 * inputLayer.ts
 *
 * Centralized hierarchical input layer manager.
 * Stack priority: boot (10) -> page (20) -> menu (30) -> briefing (40) -> loadout (50) -> certViewer (60).
 * Only the active layer with the highest priority receives hotkey events.
 * Handlers automatically ignore Enter and Space when focus is on interactive controls
 * (input, textarea, button, a, [contenteditable]).
 */

import { useEffect, useRef } from 'react';

export type InputLayer = 'boot' | 'page' | 'menu' | 'briefing' | 'loadout' | 'certViewer';

const LAYER_PRIORITY: Record<InputLayer, number> = {
  boot: 10,
  page: 20,
  menu: 30,
  briefing: 40,
  loadout: 50,
  certViewer: 60,
};

export type KeyHandler = (e: KeyboardEvent) => void;
export type KeyHandlerMap = Record<string, KeyHandler>;

interface LayerRegistration {
  id: number;
  layer: InputLayer;
  getHandlers: () => KeyHandlerMap;
}

let nextId = 1;
const registrations: LayerRegistration[] = [];
let isListenerAttached = false;

export function getActiveLayer(): InputLayer | null {
  if (registrations.length === 0) return null;
  let topLayer: InputLayer | null = null;
  let maxPriority = -1;
  for (let i = 0; i < registrations.length; i++) {
    const layer = registrations[i].layer;
    const priority = LAYER_PRIORITY[layer] ?? 0;
    if (priority > maxPriority) {
      maxPriority = priority;
      topLayer = layer;
    }
  }
  return topLayer;
}

export function isLayerTop(layer: InputLayer): boolean {
  return getActiveLayer() === layer;
}

function isInteractiveTarget(target: EventTarget | null, key: string): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || target.isContentEditable) {
    return true;
  }
  if ((tag === 'button' || tag === 'a') && (key === 'Enter' || key === ' ' || key === 'Spacebar')) {
    return true;
  }
  return false;
}

function handleGlobalKeyDown(e: KeyboardEvent) {
  const activeLayer = getActiveLayer();
  if (!activeLayer) return;

  // Let native buttons, links and text inputs receive Enter and Space
  if (isInteractiveTarget(e.target, e.key)) {
    return;
  }

  // Dispatch to the most recently registered handler on the active layer
  for (let i = registrations.length - 1; i >= 0; i--) {
    const reg = registrations[i];
    if (reg.layer === activeLayer) {
      const handlers = reg.getHandlers();
      const handler = handlers[e.key] || handlers[e.code] || handlers[e.key.toLowerCase()];
      if (handler) {
        handler(e);
        return;
      }
    }
  }
}

function ensureListener() {
  if (!isListenerAttached && typeof window !== 'undefined') {
    window.addEventListener('keydown', handleGlobalKeyDown);
    isListenerAttached = true;
  }
}

/**
 * Hook to register key handlers for a given layer.
 * Only triggers if the layer is currently the topmost active layer.
 */
export function useHotkeys(layer: InputLayer, handlers: KeyHandlerMap, enabled: boolean = true): void {
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    if (!enabled) return;
    ensureListener();
    const id = nextId++;
    const reg: LayerRegistration = {
      id,
      layer,
      getHandlers: () => handlersRef.current,
    };
    registrations.push(reg);

    return () => {
      const idx = registrations.findIndex((r) => r.id === id);
      if (idx !== -1) {
        registrations.splice(idx, 1);
      }
    };
  }, [layer, enabled]);
}
