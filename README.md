# 카드마을 <CardVille>

CardVille은 Phaser 3 + TypeScript + Firebase 무료 플랜 + GitHub Pages로 만드는 모바일 AAA 캐주얼 수집형 카드 퍼즐 게임입니다.

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

https://junl-im.github.io/CardVille/

## 핵심 구조

- `src/game/scenes`: Phaser 화면
- `src/game/systems`: 인증, 모드, 저장, 카카오 브라우저 대응 시스템
- `src/game/ui`: 카드, 글래스 패널 등 UI 컴포넌트
- `src/firebase`: Firebase 초기화, Auth, Firestore 저장
- `public/assets/data`: JSON 기반 게임 데이터
- `.github/workflows/deploy.yml`: GitHub Pages 자동 배포
- `firebase/firestore.rules`: Firestore 보안 규칙

## 금지 정책

- SVG 사용 금지
- 외부 서버 의존형 핵심 게임 데이터 금지
- 모바일 가독성을 해치는 작은 텍스트 금지

## v0.1 포함 기능

- CardVille 타이틀 화면
- 홈 화면
- 낱말 카드 모드 1스테이지
- 카드 선택 / 정답 판정 / 오답 흔들림
- 정답 파티클
- 스테이지 클리어 팝업
- Firebase 익명 로그인 및 유저 문서 생성
- Firestore 진행도 저장 함수
- GitHub Actions 자동 배포
