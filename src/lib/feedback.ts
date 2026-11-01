/**
 * Haptic feedback helper using navigator.vibrate.
 * Supported on modern Android browsers; fails silently on iOS / unsupported platforms.
 */
export function haptic(pattern: number | number[] = 10): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Fail silently
  }
}
