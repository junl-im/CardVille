import { SettingsSystem } from './SettingsSystem';

export type SfxKey = 'button' | 'card' | 'correct' | 'wrong' | 'reward' | 'levelUp' | 'pack';

export class AudioSystem {
  static playSfx(key: SfxKey): void {
    if (!SettingsSystem.get().sfx) return;
    if (typeof window === 'undefined') return;

    // v0.7은 실제 음원 파일이 없어도 안전하게 동작하는 무음 SFX 훅이다.
    // 향후 public/assets/audio/sfx/*.webm 파일이 추가되면 여기서 재생 매핑만 붙이면 된다.
    window.dispatchEvent(new CustomEvent('cardville:sfx', { detail: { key } }));
  }

  static setBgmEnabled(enabled: boolean): void {
    SettingsSystem.update({ bgm: enabled });
    window.dispatchEvent(new CustomEvent('cardville:bgm', { detail: { enabled } }));
  }
}
