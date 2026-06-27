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

## v0.5.1 업데이트 - 카드팩 + 컬렉션 저장

CardVille의 핵심 보상 루프를 추가했습니다.

```txt
스테이지 클리어
↓
결과
↓
경험치 / 코인 지급
↓
카드팩 획득
↓
카드팩 오픈
↓
새 카드 획득
↓
컬렉션 앨범 등록
```

추가 내용:

- `card_packs.json` 카드팩 데이터 추가
- `CollectionSystem` 추가
- 카드팩 오픈 연출 추가
- 카드 3장 보상 표시 추가
- localStorage 기반 앨범 저장 추가
- Firestore 컬렉션 저장 함수 추가
- Firestore Rules 컬렉션 필드 확장
- 컬렉션 앨범 화면 실제 보유/미보유 표시

자세한 내용은 `docs/CARD_PACK_COLLECTION_LOOP.md`를 확인하세요.


## v0.5.1 적용 내용

- Firebase Auth 로그인 UI 완성
- 게스트 / 이메일 / Google 로그인 연결
- 게스트 계정의 이메일 또는 Google 계정 연결 로직 추가
- 메인 로비 로그인 상태 표시
- 로그아웃 / 계정 변경 버튼 추가
- Firestore 유저 프로필 인증 필드 확장
- Firestore Rules v0.5.1 반영



## v0.5.1 배포 안정화

GitHub Actions에서 npm ci 대신 안정형 npm install 방식을 사용합니다. 빌드 중 package-lock.json을 제거하고 npm 공식 registry를 명시해 설치 오류를 줄였습니다.


## npm 설치 안정화

`.npmrc`에서 npm 공식 registry와 `package-lock=false`를 명시합니다. GitHub Actions와 로컬 개발 환경에서 기존 lock 파일로 인한 설치 문제를 줄이기 위한 설정입니다.
