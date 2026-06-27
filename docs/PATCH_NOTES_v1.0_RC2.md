# CardVille v1.0-rc.2 Patch Notes

## 목적
v1.0-rc.1에서 첫 화면이 열리지 않는 상황을 우선 해결하기 위한 부팅 안정화 핫픽스입니다.

## 핵심 수정
- 이전 cache-first service worker가 오래된 index.html 또는 삭제된 해시 JS를 제공해 빈 화면이 생길 수 있는 구조를 제거했습니다.
- production 기본값에서는 PWA service worker 등록을 비활성화했습니다.
- `/CardVille/reset.html` 캐시 초기화 페이지를 추가했습니다.
- 첫 화면 JavaScript 오류가 발생해도 HTML fallback 화면과 캐시 초기화 버튼이 보이도록 `startupGuard`를 추가했습니다.
- Auth restore에 타임아웃을 추가해 Firebase 상태 확인이 멈춰도 로그인 화면이 계속 동작하게 했습니다.
- Phaser 부팅 타입을 `CANVAS`로 변경해 WebGL 컨텍스트 문제 가능성을 줄였습니다.
- `npm run check:boot`를 추가해 부팅 필수 파일, 씬 중복, GitHub Pages base, reset 페이지 존재를 검사합니다.

## 운영 메모
기존 브라우저가 오래된 service worker에 잡혀 있으면 `/CardVille/reset.html`을 한 번 열어 캐시를 정리하세요.
