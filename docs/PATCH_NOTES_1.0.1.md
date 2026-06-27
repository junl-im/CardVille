# CardVille 1.0.1 Patch Notes

## 목적

카카오 브라우저 부팅 실패, 게스트 시작 지연, 버튼 터치 영역 불일치, rc 버전 표기 문제를 안정화했습니다.

## 변경 사항

- 버전 표기를 `1.0.1` 숫자 방식으로 통일했습니다.
- 카카오 브라우저에서는 Service Worker와 DOM 비디오를 우회합니다.
- 카카오 브라우저에서는 로딩 중 필수 에셋만 먼저 불러오도록 축소했습니다.
- 게스트 시작은 Firebase 익명 로그인을 기다리지 않고 로컬 게스트로 즉시 입장합니다.
- Google/이메일 로그인 시점에만 Firebase 모듈을 동적 로딩합니다.
- Firestore 프로필/보상/진행도/컬렉션 저장은 로컬 게스트에서는 호출하지 않습니다.
- 버튼 터치 영역을 시각 영역보다 크게 확장했습니다.
- 이메일 입력 DOM은 기본 화면에서 제거하고, 필요할 때만 모달로 표시합니다.

## 검증

- npm run check:boot
- npm run check:imports
- npm run check:json
- npm run check:assets
- npm run check:catalog
- npm run check:ui
- npm run build
- npm run check:budget
- npm run verify
