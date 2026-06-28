# CardVille 1.0.16 Patch Notes

## 목표

1. 첫 접속 때 `카드마을을 여는 중` 부팅 화면이 보이지 않게 한다.
2. 첫 화면은 바로 시작 화면처럼 보여야 한다.
3. 오프닝 인트로 영상은 앱을 여는 순간이 아니라 `게임 시작`을 누른 뒤 게임 준비 중에 재생한다.
4. 정상 실행 중인 말 카드 스택 게임 흐름은 깨지지 않게 유지한다.

## 변경 사항

- `index.html` fallback을 풀스크린 시작 화면 형태로 변경했다.
- `BootScene`은 로그인 화면에 필요한 최소 에셋만 preload한다.
- `BootScene`에서 `IntroLoadingScene`으로 자동 이동하던 흐름을 제거했다.
- `LoginScene`이 완전히 그려진 뒤 HTML fallback을 제거한다.
- `게임 시작`, Google, 이메일 로그인 성공 후 `IntroLoadingScene`으로 이동한다.
- `IntroLoadingScene`은 DOM video overlay로 `cardville_intro_loading.mp4`를 재생하면서 게임 UI/카드팩/효과 에셋을 로딩한다.
- 영상 자동재생 실패, 영상 오류, 터치 스킵, 로딩 지연 상황에 fallback을 추가했다.
- 검증 스크립트에 `BootScene` 자동 인트로 금지, `index.html` 부팅 문구 금지, 지연 인트로 로딩 토큰 검사를 추가했다.

## 유지 사항

- 게스트 즉시 시작
- 말 카드 스택 플레이
- 점수/콤보/보너스/힌트/셔플
- 보상 카드팩 오픈
- 카드 앨범 저장
- 뒤로가기 확인 팝업
- SVG 사용 금지
- Service Worker/PWA 캐시 비활성
