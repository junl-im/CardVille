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

export function scaledCount(base: number, quality: CardVilleQuality): number {
  return Math.max(1, Math.round(base * quality.ambientScale));
}

export function qualitySummary(quality: CardVilleQuality): string {
  const reasonText = quality.reasons.length ? ` · ${quality.reasons.join(', ')}` : '';
  return `${quality.label} · ambient ${Math.round(quality.ambientScale * 100)}%${reasonText}`;
}
