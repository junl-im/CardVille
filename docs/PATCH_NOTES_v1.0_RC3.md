# CardVille v1.0-rc.3 Patch Notes

## 핵심 변경

- 상용 유저가 직접 캐시 초기화 페이지를 열 필요 없도록 자동 캐시 마이그레이션을 추가했다.
- 기존 서비스워커가 남아 있어도 새 `sw.js`가 활성화되면 클라이언트를 최신 URL로 자동 이동한다.
- 클라이언트 부팅 단계에서 `prepareRuntimeCache()`를 실행해 캐시와 서비스워커를 한 번 더 정리한다.
- 부팅 fallback UI의 z-index를 높여 런타임 오류가 발생해도 안내 화면이 확실히 보이게 했다.
- `public/build.json`을 추가해 배포 버전 추적 기반을 마련했다.
- `check:boot` 검사를 강화해 자동 마이그레이션 코드 누락을 검출한다.

## 상용 운영 기준

- 사용자는 일반 주소 `/CardVille/`만 접속한다.
- `reset.html`은 고객센터/개발자용 보조 복구 주소로만 유지한다.
- PWA 캐싱은 final에서 network-first 정책으로 재활성화한다.
