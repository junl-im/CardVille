export interface CardVilleSettings {
  bgm: boolean;
  sfx: boolean;
  haptic: boolean;
  reducedMotion: boolean;
  dataSaver: boolean;
}

const STORAGE_KEY = 'cardville.settings.v1';

const DEFAULT_SETTINGS: CardVilleSettings = {
  bgm: true,
  sfx: true,
  haptic: true,
  reducedMotion: false,
  dataSaver: false
};

export class SettingsSystem {
  private static cache: CardVilleSettings | null = null;

  static get(): CardVilleSettings {
    if (this.cache) return this.cache;
    if (typeof window === 'undefined') {
      this.cache = { ...DEFAULT_SETTINGS };
      return this.cache;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) as Partial<CardVilleSettings> : {};
      this.cache = {
        ...DEFAULT_SETTINGS,
        ...Object.fromEntries(Object.entries(parsed).filter(([, value]) => typeof value === 'boolean'))
      } as CardVilleSettings;
    } catch (error) {
      console.warn('[CardVille] Failed to load settings.', error);
      this.cache = { ...DEFAULT_SETTINGS };
    }

    return this.cache;
  }

  static update(patch: Partial<CardVilleSettings>): CardVilleSettings {
    const next = { ...this.get(), ...patch };
    this.cache = next;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.warn('[CardVille] Failed to save settings.', error);
      }
    }
    return next;
  }

  static toggle(key: keyof CardVilleSettings): CardVilleSettings {
    return this.update({ [key]: !this.get()[key] });
  }

  static reset(): CardVilleSettings {
    this.cache = { ...DEFAULT_SETTINGS };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
    }
    return this.cache;
  }
}
