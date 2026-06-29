import { AccessibilitySystem } from './AccessibilitySystem';

export type CardVilleQualityTier = 'high' | 'balanced' | 'lite';

export type CardVilleQuality = {
  tier: CardVilleQualityTier;
  reduceMotion: boolean;
  ambientScale: number;
  maxSparkles: number;
  label: string;
  reasons: string[];
  highContrast: boolean;
  largeText: boolean;
};

function hasSearchFlag(flag: string): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).has(flag);
}

export function getCardVilleQuality(): CardVilleQuality {
  const reasons: string[] = [];
  const prefs = AccessibilitySystem.getPrefs();
  const mediaReduceMotion = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reduceMotion = mediaReduceMotion || prefs.reduceMotion || hasSearchFlag('reduceMotion');

  const nav = typeof navigator !== 'undefined' ? navigator as Navigator & { deviceMemory?: number } : undefined;
  const memory = nav?.deviceMemory ?? 4;
  const cores = nav?.hardwareConcurrency ?? 4;

  let tier: CardVilleQualityTier = 'high';
  if (memory <= 2 || cores <= 2 || reduceMotion || hasSearchFlag('lite')) tier = 'lite';
  else if (memory <= 4 || cores <= 4 || hasSearchFlag('balanced')) tier = 'balanced';

  if (mediaReduceMotion) reasons.push('system-reduced-motion');
  if (prefs.reduceMotion) reasons.push('saved-reduced-motion');
  if (hasSearchFlag('reduceMotion')) reasons.push('url-reduced-motion');
  if (prefs.highContrast) reasons.push('saved-high-contrast');
  if (prefs.largeText) reasons.push('saved-large-text');
  if (memory <= 2) reasons.push('low-memory');
  if (cores <= 2) reasons.push('low-core');
  if (hasSearchFlag('lite')) reasons.push('url-lite');
  if (hasSearchFlag('balanced')) reasons.push('url-balanced');

  if (tier === 'lite') {
    return { tier, reduceMotion, ambientScale: prefs.highContrast ? 0.34 : 0.45, maxSparkles: 4, label: 'Lite', reasons, highContrast: prefs.highContrast, largeText: prefs.largeText };
  }
  if (tier === 'balanced') {
    return { tier, reduceMotion, ambientScale: prefs.highContrast ? 0.58 : 0.72, maxSparkles: 6, label: 'Balanced', reasons, highContrast: prefs.highContrast, largeText: prefs.largeText };
  }
  return { tier, reduceMotion, ambientScale: prefs.highContrast ? 0.82 : 1, maxSparkles: prefs.highContrast ? 7 : 9, label: 'High', reasons, highContrast: prefs.highContrast, largeText: prefs.largeText };
}

export function isMotionEnabled(quality: CardVilleQuality): boolean {
  return !quality.reduceMotion && quality.tier !== 'lite';
}

export function allowAmbientMotion(quality: CardVilleQuality): boolean {
  return !quality.reduceMotion;
}

export function ambientCount(base: number, quality: CardVilleQuality, minimum = 0): number {
  if (quality.reduceMotion) return minimum;
  return Math.max(minimum, Math.min(base, Math.round(base * quality.ambientScale)));
}

export function scaledCount(base: number, quality: CardVilleQuality): number {
  return Math.max(1, Math.round(base * quality.ambientScale));
}

export function scaledDuration(baseMs: number, quality: CardVilleQuality): number {
  if (quality.tier === 'lite') return Math.round(baseMs * 0.72);
  if (quality.tier === 'balanced') return Math.round(baseMs * 0.88);
  return baseMs;
}

export function qualitySummary(quality: CardVilleQuality): string {
  const reasonText = quality.reasons.length ? ` · ${quality.reasons.join(', ')}` : '';
  const accessText = `${quality.highContrast ? '고대비' : '기본명암'} · ${quality.largeText ? '큰안내' : '기본글자'}`;
  return `${quality.label} · ambient ${Math.round(quality.ambientScale * 100)}% · sparkles ${quality.maxSparkles} · ${accessText}${reasonText}`;
}
