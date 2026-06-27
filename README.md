# CardVille v0.9.0

카드마을은 Phaser 3 + TypeScript + Firebase + GitHub Pages 기반의 모바일 수집형 카드 퍼즐 게임입니다.

## v0.9 핵심

- 게스트 시작 실패 방지: Firebase Anonymous 실패 시 로컬 게스트 fallback
- 업로드 인트로 영상을 3.3초 로딩 영상으로 적용
- Login/Main Lobby/Glass UI/Button 디자인 대대 개선
- WebP 카드 이미지 로더 적용
- PNG/WebP 시드 에셋 329개 추가
- SVG 사용 금지 유지
- npm run verify 통과

## 실행

```bash
npm install --no-audit --no-fund --no-package-lock
npm run dev
```

## 검증

```bash
npm run verify
```

---

# 카드마을 <CardVille>

**CardVille**은 `Aqua Glass + Cute Premium + 2.5D` 스타일의 모바일 카드 퍼즐/수집 게임입니다.  
내부 엔진은 `Dream Cards Engine` 구조를 사용하며, JSON만 추가해서 낱말, 연산, 영어, 기억력, 퍼즐 모드를 확장할 수 있도록 설계합니다.

## 현재 버전

```txt
v0.8.0
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
npm run check:assets
npm run build
npm run check:budget
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

## v0.8.0 대규모 품질 개선 업데이트

v0.8.0은 UI 겹침, 카드 연출, 컬렉션 페이지네이션, 성능 옵션, 데이터 검증, 에셋 정책을 함께 정리한 품질 개선 패치입니다.

```txt
✅ 퍼즐 카드 모드 오픈
✅ 총 15개 스테이지로 확장
✅ 컬렉션 24종 → 48종 확장
✅ 컬렉션 앨범 페이지네이션 추가
✅ 컬렉션 필터 추가: 전체 / 보유 / 미획득 / 희귀+ / 전설+
✅ 카드 선택 부유감 개선
✅ 카드 등장 애니메이션 추가
✅ 카드 정답/오답 연출 안정화
✅ PlayScene 카드 배치 동적 계산
✅ 점수 / 콤보 / 이동 / 실수 / 시간 결과 표시
✅ PerformanceSystem 추가
✅ LayoutSystem 추가
✅ VisualSystem 추가
✅ 설정의 절전 / 데이터 절약 옵션을 파티클 예산에 반영
✅ SVG 금지 에셋 검사 추가
✅ 번들 용량 예산 검사 추가
✅ service worker 캐시 v0.8 갱신
✅ GitHub Actions verify 강화
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
npm run check:assets
npm run build
npm run check:budget
```

즉, 앞으로는 상대 import 누락, JSON 짝 데이터 오류, SVG 유입, TypeScript 빌드 오류, 번들 예산 초과를 배포 전에 잡습니다.
