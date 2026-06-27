const FALLBACK_ID = 'cardville-boot-fallback';

function getBasePath(): string {
  return import.meta.env.BASE_URL || '/CardVille/';
}

export function installStartupGuard(): void {
  if (typeof document === 'undefined') return;
  const app = document.getElementById('app');
  if (!app || document.getElementById(FALLBACK_ID)) return;

  const base = getBasePath();
  const fallback = document.createElement('div');
  fallback.id = FALLBACK_ID;
  fallback.innerHTML = `
    <div class="cv-boot-card">
      <div class="cv-boot-mark">CV</div>
      <div class="cv-boot-title">카드마을을 여는 중</div>
      <div class="cv-boot-note">첫 실행 화면을 준비하고 있어요.</div>
      <button class="cv-boot-reset" type="button">캐시 초기화 후 다시 열기</button>
    </div>
  `;
  app.appendChild(fallback);

  fallback.querySelector<HTMLButtonElement>('.cv-boot-reset')?.addEventListener('click', () => {
    window.location.href = `${base}reset.html?from=boot&ts=${Date.now()}`;
  });
}

export function markGameBooted(): void {
  if (typeof document === 'undefined') return;
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
    note.textContent = `부팅 오류가 감지됐어요. 캐시 초기화를 먼저 시도해 주세요. (${message.slice(0, 90)})`;
  }
}

export function installGlobalErrorReporter(): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('error', (event) => showBootError(event.error ?? event.message));
  window.addEventListener('unhandledrejection', (event) => showBootError(event.reason));
}
