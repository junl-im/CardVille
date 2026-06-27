# Boot Stability Audit v1.0-rc.2

## 발견 원인 후보
1. 이전 service worker가 `/CardVille/`와 `/CardVille/index.html`을 cache-first로 제공했습니다.
2. GitHub Pages 배포 후 이전 index.html이 삭제된 해시 JS를 가리키면 첫 화면이 빈 화면이 될 수 있습니다.
3. Firebase Auth restore가 타임아웃 없이 대기하면 로그인 화면 상태 전환이 멈출 수 있습니다.
4. 일부 모바일 브라우저에서 WebGL 컨텍스트 생성이 실패하면 Phaser.AUTO 부팅이 불안정할 수 있습니다.

## 수정 방향
- navigation과 build asset을 cache-first로 제공하지 않습니다.
- RC2에서는 service worker를 기본 등록하지 않습니다.
- legacy service worker와 cardville-cache-* 캐시를 자동 정리합니다.
- reset.html을 제공합니다.
- HTML fallback과 전역 오류 표시기를 제공합니다.
- CANVAS 렌더러를 기본값으로 사용합니다.
