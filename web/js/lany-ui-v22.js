(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  function show(id) {
    const dialog = $(id);
    if (!dialog) return;
    dialog.hidden = false;
    dialog.querySelector('button')?.focus();
  }
  function close(id) {
    const dialog = $(id);
    if (dialog) dialog.hidden = true;
  }
  function syncSound() {
    const on = typeof bgMusicOn !== 'undefined' && bgMusicOn;
    const button = $('lany-title-sound');
    if (button) {
      button.setAttribute('aria-label', on ? '배경 음악 끄기' : '배경 음악 켜기');
      button.setAttribute('aria-pressed', String(on));
      button.querySelector('img').src = './assets/ui/v22/icons/btn-sound-' + (on ? 'on' : 'off') + '.webp';
    }
    const setting = $('lany-setting-sound');
    if (setting) setting.textContent = on ? '배경 음악 끄기' : '배경 음악 켜기';
  }
  function toggleSound() {
    window.toggleBgMusic?.();
    syncSound();
  }
  document.addEventListener('DOMContentLoaded', syncSound);
  window.LanyUi22 = {
    openSettings: () => show('lany-settings-v22'),
    closeSettings: () => close('lany-settings-v22'),
    openNotice: () => show('lany-notice-v22'),
    closeNotice: () => close('lany-notice-v22'),
    toggleSound,
    syncSound,
  };
})();
