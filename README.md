# CardVille 1.0.12

카드마을 `<CardVille>` 1.0.12는 1.0.11의 말 카드 스택 게임 구조를 유지하면서, 첫 화면 연출과 모바일 뒤로가기 UX를 다듬은 버전입니다.

## 이번 버전 핵심

- 첫 로그인 화면 배경을 업로드된 CardVille 키아트로 교체
- 로딩 구간에서 기존 인트로 오프닝 MP4 재생
- 휴대폰 뒤로가기 시 확인 팝업 표시
- 팝업에서 `첫 화면가기`, `나가기`, `계속하기` 제공
- 뒤로가기를 한 번 더 누르면 나가기 시도
- Service Worker/PWA는 계속 비활성 상태 유지
- SVG 사용 금지 유지

## 실행 흐름

```txt
BootScene
→ IntroLoadingScene: 인트로 영상 로딩 화면
→ LoginScene: 키아트 배경 + 로그인/게스트 버튼
→ MainLobbyScene
→ Mode/Stage/Play/Result/Reward/Collection
```

## 배포

GitHub Pages는 GitHub Actions 방식을 권장합니다.

```txt
Settings → Pages → Source: GitHub Actions
```

## 검증

```bash
npm install --no-audit --no-fund --no-package-lock
npm run verify
```

검증 항목:

- TypeScript 빌드
- Vite 빌드
- GitHub Pages `/CardVille/` base 경로
- 브랜드 문구 검사
- UI/콘텐츠 검사
- SVG 파일 0개 검사
- 로그인 배경/인트로 영상/뒤로가기 팝업 파일 검사
