# CardVille 1.0.18 Patch Notes

## 목적

1.0.18은 첫 시작 화면의 버튼 위치가 너무 아래에 붙어 보이는 문제를 수정한 UI/UX 보정 패치입니다.

## 변경 사항

- `LoginScene`의 게임 시작 / Google 로그인 / 이메일 / 가입 버튼 묶음을 위로 이동
- 시작 안내 문구와 하단 CTA 패널도 함께 상향 조정
- `index.html` 첫 페인트 fallback 버튼 위치도 위로 이동
- GitHub Actions deploy proof가 더 이상 하드코딩된 이전 버전을 쓰지 않고 `package.json` 버전을 자동 사용하도록 수정
- `check:deploy`에서 deploy proof 버전 하드코딩을 검사하도록 강화
- `check:ui`, `check:layout`에서 로그인 버튼 위치 상수 존재를 검사하도록 강화

## 유지 사항

- 첫 화면 즉시 표시
- 게임 시작 후 인트로 영상 재생
- full-bleed responsive canvas
- 말 카드 스택 플레이
- 카드팩 보상
- 뒤로가기 팝업
- SVG 미사용
- Service Worker / PWA 캐시 비활성
