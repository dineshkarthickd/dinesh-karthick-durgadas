/**
 * useMediaQuery.ts
 *
 * Synchronous client-side media query hook using useSyncExternalStore.
 * Initial snapshot matches window.matchMedia immediately on first render without flash.
 */

import { useSyncExternalStore } from 'react';

export const DESKTOP_MEDIA_QUERY = '(min-width: 1024px) and (orientation: landscape)';

interface QueryStore {
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => boolean;
}

const queryStoreCache = new Map<string, QueryStore>();

function getOrCreateStore(query: string): QueryStore {
  let store = queryStoreCache.get(query);
  if (!store) {
    const subscribe = (callback: () => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) {
        return () => {};
      }
      const mql = window.matchMedia(query);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    };
    const getSnapshot = () => {
      if (typeof window === 'undefined' || !window.matchMedia) {
        return false;
      }
      return window.matchMedia(query).matches;
    };
    store = { subscribe, getSnapshot };
    queryStoreCache.set(query, store);
  }
  return store;
}

const getServerSnapshot = () => false;

export function useMediaQuery(query: string): boolean {
  const store = getOrCreateStore(query);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot);
}

/**
 * Returns true if the screen is at least 1024px wide AND in landscape orientation
 * (matching the @custom-variant lg defined in index.css).
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(DESKTOP_MEDIA_QUERY);
}
