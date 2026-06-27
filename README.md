# 카드마을 <CardVille>

**CardVille**은 `Aqua Glass + Cute Premium + 2.5D` 스타일의 모바일 카드 퍼즐/수집 게임입니다.  
내부 엔진은 `Dream Cards Engine` 구조를 사용하며, JSON만 추가해서 낱말, 연산, 영어, 기억력, 퍼즐 모드를 확장할 수 있도록 설계합니다.

## 현재 버전

```txt
v0.6.0
```

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

## v0.6 적용 내용 - 유저 성장 데이터 연동

v0.6부터 메인 로비가 임시 숫자가 아니라 실제 유저 성장 데이터를 사용합니다.

```txt
Firestore users/{uid}
↓
UserDataSystem
↓
Main Lobby 상단 재화 / 레벨 / XP 바
↓
RewardScene 보상 저장
↓
다시 Main Lobby에서 증가된 성장 데이터 표시
```

추가 내용:

- Firestore 유저 프로필 로딩 함수 추가
- 유저 데이터 캐시 / localStorage fallback 추가
- 메인 로비 코인 / 보석 / 레벨 실제 데이터 표시
- XP 진행바 UI 추가
- 보상 획득 시 XP / 코인 저장 결과 표시
- 레벨업 토스트 연출 추가
- 오프라인 또는 Firestore 실패 시 로컬 임시 저장 fallback

자세한 내용은 `docs/USER_GROWTH_SYSTEM.md`와 `docs/PATCH_NOTES_v0.6.md`를 확인하세요.

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
현재 워크플로는 GitHub Actions에서 npm 오류를 줄이기 위해 lock 파일 없이도 동작하는 안정형 설치 방식을 사용합니다.

```txt
npm install --no-audit --no-fund --no-package-lock
```
