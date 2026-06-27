# CardVille v1.0-rc.3 자동 캐시 마이그레이션

## 목적

상용 서비스에서 유저에게 `reset.html`을 직접 열라고 안내하는 방식은 적합하지 않다. v1.0-rc.3부터는 사용자가 `/CardVille/`에 접속하면 앱이 자동으로 오래된 CardVille 캐시와 서비스워커를 정리한다.

## 적용 구조

1. 기존에 설치된 `/CardVille/sw.js`가 있으면 브라우저의 서비스워커 업데이트 절차를 통해 새 migration worker로 교체된다.
2. 새 `sw.js`는 `install/activate` 단계에서 `cardville-cache-*` 캐시를 삭제한다.
3. 새 `sw.js`는 열려 있는 CardVille 클라이언트를 최신 URL로 자동 navigate한다.
4. 새 index가 실행되면 `prepareRuntimeCache()`가 한 번 더 클라이언트 측 정리를 수행한다.
5. 정리 후에는 `cv_cache_migrated=1.0-rc.3` 쿼리로 1회 자동 새로고침한다.

## 핵심 정책

- `index.html`, JS, CSS는 cache-first 금지
- 대용량 `cards_image` 전체 캐시 금지
- PWA 캐싱은 v1.0-final 전까지 기본 비활성화
- `reset.html`은 수동 복구용으로만 유지

## 관련 파일

- `public/sw.js`
- `public/reset.html`
- `public/build.json`
- `src/pwa/registerServiceWorker.ts`
- `src/diagnostics/startupGuard.ts`
- `tools/check-boot-files.mjs`
