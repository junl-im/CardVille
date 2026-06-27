const FALLBACK_ID = 'cardville-boot-fallback';
const BUILD_ID = '1.0.4';

function getBasePath(): string {
  return import.meta.env.BASE_URL || '/CardVille/';
}

function getResetUrl(): string {
  const base = getBasePath();
  return `${base}reset.html?from=boot&build=${BUILD_ID}&ts=${Date.now()}`;
}

export function installStartupGuard(): void {
  if (typeof document === 'undefined') return;
  const app = document.getElementById('app');
  if (!app || document.getElementById(FALLBACK_ID)) return;

  const fallback = document.createElement('div');
  fallback.id = FALLBACK_ID;
  fallback.innerHTML = `
    <div class="cv-boot-card">
      <div class="cv-boot-mark">CV</div>
      <div class="cv-boot-title">카드마을을 여는 중</div>
      <div class="cv-boot-note">최신 버전과 캐시 상태를 자동으로 확인하고 있어요.</div>
      <div class="cv-boot-progress"><span></span></div>
      <button class="cv-boot-reset" type="button">자동 복구 다시 실행</button>
    </div>
  `;
  app.appendChild(fallback);

  fallback.querySelector<HTMLButtonElement>('.cv-boot-reset')?.addEventListener('click', () => {
    window.location.href = getResetUrl();
  });

  window.setTimeout(() => {
    if (!document.getElementById(FALLBACK_ID)) return;
    const note = fallback.querySelector<HTMLElement>('.cv-boot-note');
    if (note) note.textContent = '로딩이 길어지고 있어요. 자동 복구를 준비 중입니다.';
  }, 8000);
}

export function markGameBooted(): void {
  if (typeof document === 'undefined') return;
  window.__CARDVILLE_APP_STARTED__ = true;
  window.__CARDVILLE_MARK_HTML_BOOTED__?.();
  const fallback = document.getElementById(FALLBACK_ID);
  if (!fallback) return;
  fallback.classList.add('is-hidden');
  window.setTimeout(() => fallback.remove(), 420);
}

export function showBootError(error: unknown): void {
  if (typeof document === 'undefined') return;
  installStartupGuard();
  const fallback = document.getElementById(FALLBACK_ID);
  fallback?.classList.remove('is-hidden');
  const note = fallback?.querySelector<HTMLElement>('.cv-boot-note');
  if (note) {
    const message = error instanceof Error ? error.message : String(error ?? '알 수 없는 오류');
    note.textContent = `부팅 오류가 감지됐어요. 자동 복구를 다시 실행해 주세요. (${message.slice(0, 90)})`;
  }
}

export function installGlobalErrorReporter(): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('error', (event) => showBootError(event.error ?? event.message));
  window.addEventListener('unhandledrejection', (event) => showBootError(event.reason));
  window.addEventListener('message', (event) => {
    if (!event.data || event.data.type !== 'CARDVILLE_SW_MIGRATED') return;
    window.sessionStorage.setItem('cardville.sw.migrated', String(event.data.buildId ?? BUILD_ID));
  });
}
