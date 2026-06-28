export type FeedbackKind = 'tap' | 'correct' | 'wrong' | 'reward';

let audioContext: AudioContext | null = null;
let lastBeepAt = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!audioContext) audioContext = new AudioCtor();
  return audioContext;
}

function vibrate(pattern: number | number[]): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern);
  } catch { /* vibration is optional */ }
}

function beep(frequency: number, duration = 0.045, gain = 0.018): void {
  const now = Date.now();
  if (now - lastBeepAt < 90) return;
  lastBeepAt = now;
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  amp.gain.value = gain;
  osc.connect(amp);
  amp.connect(ctx.destination);
  const t = ctx.currentTime;
  osc.start(t);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.stop(t + duration + 0.01);
}

export class FeedbackSystem {
  static pulse(kind: FeedbackKind): void {
    if (kind === 'tap') { vibrate(8); beep(520, 0.035, 0.010); return; }
    if (kind === 'correct') { vibrate([10, 20, 14]); beep(760, 0.055, 0.016); return; }
    if (kind === 'wrong') { vibrate([18, 28, 18]); beep(220, 0.06, 0.014); return; }
    vibrate([10, 18, 10, 18, 16]);
    beep(920, 0.07, 0.018);
  }
}
