/**
 * Haptic feedback helper using navigator.vibrate.
 * Only calls vibrate when:
 * 1. The device has a touch/coarse pointer
 * 2. The user has actively interacted with the page (userActivation.hasBeenActive)
 * 3. 'vibrate' in navigator
 * Otherwise does nothing, preventing Chrome intervention console errors.
 */
export function haptic(pattern: number | number[] = 10): void {
  try {
    if (
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      'vibrate' in navigator &&
      window.matchMedia('(pointer: coarse)').matches &&
      Boolean(navigator.userActivation?.hasBeenActive)
    ) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Fail silently
  }
}
