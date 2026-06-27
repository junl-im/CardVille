# 카드마을 <CardVille>

**CardVille**은 `Aqua Glass + Cute Premium + 2.5D` 스타일의 모바일 카드 퍼즐/수집 게임입니다.  
내부 엔진은 `Dream Cards Engine` 구조를 사용하며, JSON만 추가해서 낱말, 연산, 영어, 기억력, 퍼즐 모드를 확장할 수 있도록 설계합니다.

## 현재 버전

```txt
v0.7.0
```

## 기술 스택

```txt
Phaser 3
TypeScript
Vite
Firebase Auth / Firestore / Analytics
GitHub Pages
GitHub Actions
PWA 기본 구성
WebP / PNG
SVG 사용 금지
```

## 실행

```bash
npm install --no-audit --no-fund --no-package-lock
npm run dev
```

## 검증 / 빌드

```bash
npm run check:imports
npm run check:json
npm run build
npm run verify
```

## 배포 주소

```txt
https://junl-im.github.io/CardVille/
```

`vite.config.ts`의 base는 `/CardVille/`로 설정되어 있습니다.

## 화면 흐름

```txt
Splash
↓
Loading
↓
Login
↓
Main Lobby
↓
꿈의 서고
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

## v0.7.0 초대규모 업데이트

v0.7.0은 기능 추가만이 아니라 안정성, 검증, UI 겹침, 데이터 구조를 같이 정리한 대규모 패치입니다.

```txt
✅ 스테이지 잠금 / 해금
✅ 별 1~3개 클리어 등급
✅ 모드별 진행률 표시
✅ 꿈의 서고 책별 진행도 표시
✅ 낱말 / 연산 / 기억력 / 영어 4개 모드 오픈
✅ 총 12개 스테이지 데이터 추가
✅ 일일 미션 화면 추가
✅ 출석 보상 추가
✅ 설정 화면 추가
✅ 사운드 / 진동 / 절전 / 데이터 절약 옵션 추가
✅ PWA manifest / service worker / PNG 아이콘 추가
✅ 컬렉션 기본 카드 24종 확장
✅ Firestore progress Rules 확장
✅ JSON 데이터 검증 스크립트 추가
✅ GitHub Actions에서 verify 실행
```

## Firebase

Firebase 설정은 `src/firebase/firebaseApp.ts`에 들어 있습니다.

지원 로그인:

```txt
익명 로그인
이메일 로그인
Google 로그인
```

Firebase Console에서 아래 항목을 확인하세요.

```txt
Authentication > Sign-in method
- Anonymous 활성화
- Email/Password 활성화
- Google 활성화

Authentication > Settings > Authorized domains
- junl-im.github.io 추가
```

Firestore Rules는 `firebase/firestore.rules`를 사용합니다.

## 에셋 규칙

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
현재 워크플로는 설치 후 아래 검증을 모두 실행합니다.

```txt
npm run check:imports
npm run check:json
npm run build
```

즉, 앞으로는 상대 import 누락, JSON 짝 데이터 오류, TypeScript 빌드 오류를 배포 전에 잡습니다.
