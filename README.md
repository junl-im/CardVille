# 카드마을 <CardVille>

Aqua Glass + Cute Premium + 2.5D 스타일의 모바일 카드 퍼즐/수집 게임입니다.

## 기술 스택

```txt
Phaser 3
TypeScript
Vite
Firebase Auth / Firestore / Analytics
GitHub Pages
GitHub Actions
WebP / PNG
SVG 사용 금지
```

## 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

## 배포 주소

```txt
https://junl-im.github.io/CardVille/
```

`vite.config.ts`의 base는 `/CardVille/`로 설정되어 있습니다.

## v0.2 화면 흐름

```txt
Splash
↓
Loading
↓
Login
↓
Main Lobby
↓
Mode Select
↓
Stage Select
↓
Play
↓
Result
↓
Reward
↓
Main Lobby
```

## Firebase

Firebase 설정은 `src/firebase/firebaseApp.ts`에 들어 있습니다.

지원 로그인:

```txt
익명 로그인
이메일 로그인 함수 준비
Google 로그인
```

현재 이메일 로그인은 함수는 준비되어 있고, 실제 입력 UI는 v0.3에서 연결합니다.

## 에셋

에셋 규칙은 `docs/ASSET_PIPELINE.md`를 기준으로 합니다.

핵심 원칙:

```txt
SVG 금지
WebP/PNG 사용
1024x1024 원본 제작
좌상단 광원
우하단 그림자
Aqua Glass + Cute Premium + 2.5D
```

## GitHub Actions

`.github/workflows/deploy.yml`에 GitHub Pages 자동 배포가 들어 있습니다.

현재 워크플로는 lock 파일 없이도 동작하도록 `npm install --no-audit --no-fund`를 사용합니다.
