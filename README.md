# 카드마을 CardVille 1.0.1

이번 `1.0.1`은 카카오 브라우저 접속, 게스트 시작 속도, 버튼 터치 영역을 우선으로 고친 안정화 패치입니다.

## 핵심 변경

- 게스트 시작은 Firebase 서버를 기다리지 않고 로컬 게스트로 즉시 입장합니다.
- Google/이메일 로그인만 Firebase 서버 인증을 사용합니다.
- 카카오 브라우저에서는 Service Worker와 DOM 비디오를 우회하고 안정 모드로 부팅합니다.
- 버튼 시각 영역보다 터치 영역을 크게 잡아 특정 부위만 눌리는 문제를 줄였습니다.
- 버전 표기를 `1.0.1` 숫자 체계로 변경했습니다.
- Firebase / Firestore 모듈은 필요할 때만 동적 로딩되도록 바꾸었습니다.

## 실행

```bash
npm install --no-audit --no-fund --no-package-lock
npm run dev
```

## 검증

```bash
npm run verify
```

## 배포 주소

https://junl-im.github.io/CardVille/
