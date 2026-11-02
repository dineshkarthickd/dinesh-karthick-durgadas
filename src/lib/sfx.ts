/**
 * Web Audio API retro-synth sound effects (retro neon style).
 * Pure synthesis in code — zero external audio files and zero copyrighted samples.
 */

const SFX_STORAGE_KEY = 'dk_sfx_enabled';

let audioCtx: AudioContext | null = null;
let sfxEnabled: boolean = (() => {
  try {
    const saved = localStorage.getItem(SFX_STORAGE_KEY);
    return saved === null ? true : saved === 'true';
  } catch {
    return true;
  }
})();

const listeners = new Set<(enabled: boolean) => void>();

export function isSfxEnabled(): boolean {
  return sfxEnabled;
}

function setSfxEnabled(enabled: boolean): void {
  sfxEnabled = enabled;
  try {
    localStorage.setItem(SFX_STORAGE_KEY, String(enabled));
  } catch {
    // Ignore storage errors
  }
  listeners.forEach((fn) => fn(sfxEnabled));
}

export function toggleSfx(): boolean {
  setSfxEnabled(!sfxEnabled);
  return sfxEnabled;
}

export function subscribeSfx(callback: (enabled: boolean) => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Initializes or resumes the shared AudioContext on user interaction.
 */
export function initAudio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

// Throttle for move blip: max 1 per 60ms
let lastMoveTime = 0;

/**
 * Move sound: 35ms square-wave blip, 1320 Hz -> 990 Hz, gain .06, quick decay.
 */
export function playMoveSound(): void {
  if (!sfxEnabled) return;
  const now = Date.now();
  if (now - lastMoveTime < 60) return;
  lastMoveTime = now;

  const ctx = initAudio();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1320, t);
    osc.frequency.exponentialRampToValueAtTime(990, t + 0.035);

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.036);
  } catch {
    // Fail silently
  }
}

/**
 * Select sound: two-note synth chime: 660 Hz then 990 Hz (triangle), 70ms each, gain .12, light lowpass + delay echo.
 */
export function playSelectSound(): void {
  if (!sfxEnabled) return;
  const ctx = initAudio();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;

    // Filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2800, t);

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.12, t);

    // Delay echo
    const delay = ctx.createDelay();
    delay.delayTime.setValueAtTime(0.08, t);
    const feedback = ctx.createGain();
    feedback.gain.setValueAtTime(0.25, t);

    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(filter);

    filter.connect(ctx.destination);

    // Note 1: 660 Hz (0 -> 70ms)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(660, t);
    gain1.gain.setValueAtTime(0.12, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    osc1.connect(gain1);
    gain1.connect(filter);
    gain1.connect(delay);
    osc1.start(t);
    osc1.stop(t + 0.075);

    // Note 2: 990 Hz (70ms -> 140ms)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(990, t + 0.07);
    gain2.gain.setValueAtTime(0.0001, t);
    gain2.gain.setValueAtTime(0.12, t + 0.07);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc2.connect(gain2);
    gain2.connect(filter);
    gain2.connect(delay);
    osc2.start(t + 0.07);
    osc2.stop(t + 0.145);
  } catch {
    // Fail silently
  }
}

/**
 * Back sound: 990 Hz -> 495 Hz, 90ms, triangle, gain .08.
 */
export function playBackSound(): void {
  if (!sfxEnabled) return;
  const ctx = initAudio();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(990, t);
    osc.frequency.exponentialRampToValueAtTime(495, t + 0.09);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.095);
  } catch {
    // Fail silently
  }
}

/**
 * Mission Passed sound: 3-note rising arpeggio (523, 659, 784 Hz, saw + lowpass 2.4 kHz), 120ms each, gain .12, + soft 60 Hz thump.
 */
export function playMissionPassedSound(): void {
  if (!sfxEnabled) return;
  const ctx = initAudio();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;

    // Filter for saws
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, t);
    filter.connect(ctx.destination);

    // Bass thump (60 Hz)
    const thump = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(60, t);
    thump.frequency.exponentialRampToValueAtTime(30, t + 0.3);
    thumpGain.gain.setValueAtTime(0.18, t);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    thump.connect(thumpGain);
    thumpGain.connect(ctx.destination);
    thump.start(t);
    thump.stop(t + 0.3);

    // 3 notes: C5 (523), E5 (659), G5 (784)
    const notes = [523, 659, 784];
    notes.forEach((freq, i) => {
      const noteStart = t + i * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.setValueAtTime(0.12, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.13);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(noteStart);
      osc.stop(noteStart + 0.14);
    });
  } catch {
    // Fail silently
  }
}

/**
 * Boot sound: 600ms synth swell (two detuned saws 220/221 Hz, filter sweep 400 -> 3000 Hz).
 */
export function playBootSound(): void {
  if (!sfxEnabled) return;
  const ctx = initAudio();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;
    const dur = 0.6;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(3000, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    const saw1 = ctx.createOscillator();
    saw1.type = 'sawtooth';
    saw1.frequency.setValueAtTime(220, t);

    const saw2 = ctx.createOscillator();
    saw2.type = 'sawtooth';
    saw2.frequency.setValueAtTime(221.5, t);

    saw1.connect(gain);
    saw2.connect(gain);
    gain.connect(filter);
    filter.connect(ctx.destination);

    saw1.start(t);
    saw2.start(t);
    saw1.stop(t + dur + 0.05);
    saw2.stop(t + dur + 0.05);
  } catch {
    // Fail silently
  }
}
