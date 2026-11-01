let manifestCache: Set<string> | null = null;
let manifestPromise: Promise<Set<string>> | null = null;

export function loadManifest(): Promise<Set<string>> {
  if (manifestCache) return Promise.resolve(manifestCache);
  if (manifestPromise) return manifestPromise;

  manifestPromise = fetch('/art/video/videos.json')
    .then((res) => (res.ok ? res.json() : []))
    .then((list) => {
      manifestCache = new Set(Array.isArray(list) ? list : []);
      return manifestCache;
    })
    .catch(() => {
      manifestCache = new Set();
      return manifestCache;
    });

  return manifestPromise;
}

export function shouldDisableVideo(): boolean {
  if (typeof window === 'undefined') return true;

  // 1. prefers-reduced-motion
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }

  // 2. Data saver / slow connection
  const nav = navigator as unknown as {
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (nav.connection?.saveData === true) {
    return true;
  }
  if (nav.connection?.effectiveType === 'slow-2g' || nav.connection?.effectiveType === '2g') {
    return true;
  }

  // 3. Low-end device
  if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 2) {
    return true;
  }
  const deviceMem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  if (typeof deviceMem === 'number' && deviceMem <= 2) {
    return true;
  }

  return false;
}
