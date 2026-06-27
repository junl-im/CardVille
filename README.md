# 카드마을 CardVille v1.0-rc.1

CardVille은 `Phaser 3 + TypeScript + Firebase + GitHub Pages` 기반의 모바일 수집형 카드 퍼즐 게임입니다.  
현재 버전은 **v1.0 출시 후보(RC)** 단계로, 대형 Aqua Glass 에셋팩을 실제 화면에 연결하고 UI/성능/검증 구조를 강화했습니다.

## 핵심 방향

```txt
Aqua Glass + Cute Premium + 2.5D
SVG 사용 금지
WebP / PNG 기반 그래픽
모바일 세로 화면 390x844 기준
GitHub Pages 자동 배포
Firebase 무료 플랜 중심
게스트 즉시 시작 + Firebase fallback
```

## v1.0-rc.1 핵심 업데이트

```txt
✅ 메인 로비 레이아웃 재설계
✅ 월드 배경 선택 시스템 추가
✅ 카드 뒷면 선택 시스템 추가
✅ 카드팩 확률표 화면 추가
✅ 카드 상세/확대 보기 화면 추가
✅ 컬렉션 카드 터치 상세 보기 연결
✅ 보상 화면 카드팩 PNG 연출 강화
✅ 선택 월드를 주요 화면 배경에 반영
✅ ThemeSystem 추가
✅ UI 레이아웃 검사 스크립트 추가
✅ verify 파이프라인 강화
```

## 화면 흐름

```txt
Splash
↓
Loading Intro Video
↓
Login / Guest Start
↓
Main Lobby
↓
Dream Library / Collection / Gallery / Mission / World / Card Back / Pack Info
↓
Stage Select
↓
Play
↓
Result
↓
Reward / Pack Open
↓
Collection Detail
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
npm run check:catalog
npm run check:ui
npm run build
npm run check:budget
npm run verify
```

## 배포 주소

```txt
https://junl-im.github.io/CardVille/
```

`vite.config.ts`의 base는 `/CardVille/`로 설정되어 있습니다.

## Firebase

지원 로그인:

```txt
익명 로그인
이메일 로그인
Google 로그인
로컬 게스트 fallback
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

## 대형 에셋팩 상태

```txt
카드 이미지 인덱스: 5,000장
SVG: 0개
배경 / 카드 프레임 / 카드 뒷면 / 카드팩 / 아이콘 / UI PNG-WebP 구조 적용
카드 이미지 도감은 현재 페이지 9장만 lazy-load
PWA는 5,000장 카드 이미지를 강제 캐시하지 않음
```

## 주요 폴더

```txt
src/game/scenes
src/game/systems
src/game/ui
public/assets
public/assets/data
firebase
tools
docs
```

## 다음 목표

```txt
v1.0-final
- 실제 사운드 연결
- 카드팩 오픈 애니메이션 프레임 고도화
- 카카오 브라우저 뒤로가기/종료 팝업 고도화
- 컬렉션 세트 완성 보상
- 스테이지 밸런스 및 난이도 조정
- Firebase/로컬 게스트 데이터 마이그레이션 정리
```
