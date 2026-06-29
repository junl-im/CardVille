export type CardVilleQualityTier = 'high' | 'balanced' | 'lite';

export type CardVilleQuality = {
  tier: CardVilleQualityTier;
  reduceMotion: boolean;
  ambientScale: number;
  maxSparkles: number;
  label: string;
  reasons: string[];
};

function hasSearchFlag(flag: string): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).has(flag);
}

export function getCardVilleQuality(): CardVilleQuality {
  const reasons: string[] = [];
  const reduceMotion = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nav = typeof navigator !== 'undefined' ? navigator as Navigator & { deviceMemory?: number } : undefined;
  const memory = nav?.deviceMemory ?? 4;
  const cores = nav?.hardwareConcurrency ?? 4;

  let tier: CardVilleQualityTier = 'high';
  if (memory <= 2 || cores <= 2 || reduceMotion || hasSearchFlag('lite')) tier = 'lite';
  else if (memory <= 4 || cores <= 4 || hasSearchFlag('balanced')) tier = 'balanced';

  if (reduceMotion) reasons.push('reduced-motion');
  if (memory <= 2) reasons.push('low-memory');
  if (cores <= 2) reasons.push('low-core');
  if (hasSearchFlag('lite')) reasons.push('url-lite');
  if (hasSearchFlag('balanced')) reasons.push('url-balanced');

  if (tier === 'lite') {
    return { tier, reduceMotion, ambientScale: 0.45, maxSparkles: 4, label: 'Lite', reasons };
  }
  if (tier === 'balanced') {
    return { tier, reduceMotion, ambientScale: 0.72, maxSparkles: 6, label: 'Balanced', reasons };
  }
  return { tier, reduceMotion, ambientScale: 1, maxSparkles: 9, label: 'High', reasons };
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
  return `${quality.label} · ambient ${Math.round(quality.ambientScale * 100)}% · sparkles ${quality.maxSparkles}${reasonText}`;
}
