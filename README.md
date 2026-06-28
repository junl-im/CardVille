# CardVille 1.0.6 Clean Stable

이 버전은 기존 대형 구조를 잠시 멈추고, GitHub Actions 배포에서 반드시 로그인 화면이 열리도록 재구성한 안정화 버전입니다.

## 핵심 원칙

- Service Worker 사용 안 함
- 자동 캐시 마이그레이션 사용 안 함
- 인트로 영상 사용 안 함
- 시작 시 Firebase 사용 안 함
- 대형 이미지 에셋 시작 preload 안 함
- 게스트는 서버 접속 없이 localStorage로 즉시 시작
- Google / 이메일 버튼을 눌렀을 때만 Firebase 동적 로딩

## 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run verify
```

## 배포

GitHub Pages 설정은 `GitHub Actions`를 사용하세요.

배포 후 확인 주소:

- https://junl-im.github.io/CardVille/
- https://junl-im.github.io/CardVille/health.html
- https://junl-im.github.io/CardVille/deploy-proof.html
- https://junl-im.github.io/CardVille/version.json

## 복구 정책

이 버전은 큰 기능보다 첫 접속과 게스트 시작을 우선합니다. 로그인 화면이 안정적으로 열린 뒤 1.0.6부터 디자인과 시스템을 다시 확장합니다.
