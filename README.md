# CardVille 1.0.16

카드마을 `<CardVille>` 1.0.16은 첫 접속 때 보이던 “카드마을을 여는 중” 부팅 문구를 제거하고, 바로 시작 화면처럼 보이도록 바꾼 UX 안정화 버전입니다. 인트로 영상은 이제 앱을 여는 순간이 아니라 사용자가 **게임 시작**을 누른 뒤 게임 리소스를 준비하는 동안 재생됩니다.

## 이번 버전 핵심

- 첫 접속 fallback을 부팅 문구가 아닌 풀스크린 시작 화면 형태로 변경
- `BootScene`은 로그인 화면에 필요한 최소 에셋만 로딩
- 게임 시작/로그인 후 `IntroLoadingScene`에서 인트로 영상 표시
- 인트로 영상과 동시에 게임 UI/카드팩/효과 에셋 동적 로딩
- 영상 자동재생 실패, 로드 실패, 터치 스킵 상황에서도 정상 진행
- 기존 말 카드 스택, 점수/콤보/힌트/셔플, 보상/앨범 흐름 유지
- 카드 불투명/눈 편한 UI 정책 유지
- SVG 미사용 유지
- Service Worker/PWA 캐시 비활성 유지
- GitHub Actions 배포 구조 유지

## 실행

```bash
npm install --no-audit --no-fund --no-package-lock
npm run verify
```

## 배포

GitHub Pages 설정은 아래 방식 권장입니다.

```txt
Settings → Pages → Source: GitHub Actions
```

배포 후 확인:

```txt
https://junl-im.github.io/CardVille/health.html
https://junl-im.github.io/CardVille/deploy-proof.html
https://junl-im.github.io/CardVille/
```

## 주의

1.0.16은 첫 화면 진입 속도를 위해 대형 카드 이미지 5000장을 한 번에 강제 연결하지 않습니다. 게임 시작을 누른 뒤 필요한 UI/카드팩/효과 리소스를 단계적으로 준비합니다.
