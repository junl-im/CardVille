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

## v0.3.0 화면 흐름

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


## v0.3.0 Build Fix

이 버전은 GitHub Actions 빌드 오류를 수정했습니다.

- `moduleResolution`을 `Bundler`로 변경
- `src/vite-env.d.ts` 추가
- `import.meta.env` 타입 오류 수정
- `latest` 의존성 제거 및 안정 버전 고정
- `package-lock.json` 포함
- `npm run build` 검증 완료


## v0.3 업데이트 - 꿈의 서고

CardVille의 게임 선택 화면을 단순 메뉴가 아니라 메인 월드인 **꿈의 서고(Dream Library)** 로 전환했습니다.

- 낱말의 책, 연산의 책, 기억력의 책, 영어의 책, 퍼즐의 책 구조 추가
- 새 모드는 `catalog.json`에 새 마법서 데이터만 추가하는 방식으로 확장
- Aqua Glass + Cute Premium + 2.5D 방향을 유지하는 책 UI 적용
- 잠긴 책 안내 토스트와 책 펼치기 전환 연출 추가

자세한 내용은 `docs/DREAM_LIBRARY_WORLD.md`를 확인하세요.
