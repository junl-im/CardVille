import { SettingsSystem } from './SettingsSystem';

export interface PerformanceProfile {
  reducedMotion: boolean;
  dataSaver: boolean;
  lowPower: boolean;
  maxAmbientObjects: number;
  maxBurstParticles: number;
}

export class PerformanceSystem {
  static getProfile(): PerformanceProfile {
    const settings = SettingsSystem.get();
    const reducedByDevice = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const memory = typeof navigator !== 'undefined' && 'deviceMemory' in navigator
      ? Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4)
      : 4;
    const lowPower = settings.dataSaver || memory <= 2;

    return {
      reducedMotion: settings.reducedMotion || reducedByDevice,
      dataSaver: settings.dataSaver,
      lowPower,
      maxAmbientObjects: lowPower ? 18 : 48,
      maxBurstParticles: lowPower ? 10 : 26
    };
  }

  static shouldAnimateAmbient(): boolean {
    const profile = this.getProfile();
    return !profile.reducedMotion && !profile.dataSaver;
  }

  static motionDuration(duration: number): number {
    return this.getProfile().reducedMotion ? Math.max(80, Math.round(duration * 0.45)) : duration;
  }

  static particleCount(normalCount: number): number {
    const profile = this.getProfile();
    if (profile.reducedMotion) return Math.min(6, normalCount);
    return Math.min(normalCount, profile.maxBurstParticles);
  }

  static ambientCount(normalCount: number): number {
    return Math.min(normalCount, this.getProfile().maxAmbientObjects);
  }
}
