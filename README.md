# CardVille 1.0.18

카드마을 `<CardVille>` 1.0.18은 첫 시작 화면의 **게임 시작 / 로그인 버튼 묶음을 위로 올리고**, 풀스크린 배경과 delayed intro 흐름을 유지한 UI/UX 보정 버전입니다.

## 이번 버전 핵심

- 첫 화면 하단에 너무 붙어 있던 `게임 시작`, `Google 로그인`, `이메일`, `가입` 버튼 위치 상향
- 첫 페인트 fallback의 가짜 시작 버튼 위치도 함께 상향
- 첫 화면은 바로 시작 화면처럼 표시
- 인트로 영상은 `게임 시작`을 누른 뒤 게임 리소스를 준비하는 동안만 표시
- Phaser `EXPAND` 기반 full-bleed 화면 유지
- 말 카드 스택 플레이, 점수, 콤보, 힌트, 셔플, 카드팩 보상 유지
- Service Worker / PWA 캐시 비활성 유지
- SVG 사용 금지 유지
- GitHub Actions deploy proof가 package.json 버전을 자동 사용하도록 수정

## 실행 흐름

```txt
접속
→ 풀스크린 시작 화면
→ 게임 시작 / 로그인 선택
→ 인트로 영상 + 게임 에셋 로딩
→ 카드마을 광장
→ 게임 선택
→ 말 카드 스택 플레이
→ 결과 / 보상 / 앨범
```

## 개발 실행

```bash
npm install --no-audit --no-fund --no-package-lock
npm run dev
```

## 검증

```bash
npm run verify
```

검증 항목:

```txt
npm run build
npm run check:deploy
npm run check:brand
npm run check:ui
npm run check:layout
```

## 배포

GitHub Pages 설정:

```txt
Settings
→ Pages
→ Source: GitHub Actions
```

배포 후 확인:

```txt
https://junl-im.github.io/CardVille/health.html
https://junl-im.github.io/CardVille/deploy-proof.html
https://junl-im.github.io/CardVille/version.json
https://junl-im.github.io/CardVille/
```

## 에셋 정책

- SVG 사용 금지
- PNG / WebP / MP4 사용
- 대형 카드 이미지 전체 강제 preload 금지
- 시작 화면은 가볍게 유지
- 게임 리소스는 게임 시작 후 인트로 영상 중 단계적으로 로딩
