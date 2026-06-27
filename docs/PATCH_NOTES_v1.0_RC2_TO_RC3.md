# v1.0-rc.2 → v1.0-rc.3 변경 파일 요약

- `public/sw.js`: migration worker로 변경
- `src/pwa/registerServiceWorker.ts`: 자동 클라이언트 캐시 마이그레이션 추가
- `src/main.ts`: 부팅 전에 `prepareRuntimeCache()` 실행
- `src/diagnostics/startupGuard.ts`: 자동 복구 문구와 build id 반영
- `public/reset.html`: 수동 복구 페이지를 자동 복구 보조 페이지로 변경
- `public/build.json`: 배포 빌드 정보 추가
- `tools/check-boot-files.mjs`: 자동 마이그레이션 검증 강화
- `src/styles/index.css`: 부팅 fallback 오버레이 안정화
