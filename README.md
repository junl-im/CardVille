# 카드마을 CardVille 1.0.2

이번 `1.0.2`은 카카오 브라우저 접속, 게스트 시작 속도, 버튼 터치 영역을 우선으로 고친 안정화 패치입니다.

## 핵심 변경

- 게스트 시작은 Firebase 서버를 기다리지 않고 로컬 게스트로 즉시 입장합니다.
- Google/이메일 로그인만 Firebase 서버 인증을 사용합니다.
- 카카오 브라우저에서는 Service Worker와 DOM 비디오를 우회하고 안정 모드로 부팅합니다.
- 버튼 시각 영역보다 터치 영역을 크게 잡아 특정 부위만 눌리는 문제를 줄였습니다.
- 버전 표기를 `1.0.2` 숫자 체계로 변경했습니다.
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


## 1.0.2 긴급 배포 진단

첫 화면이 완전 빈 화면이면 GitHub Pages가 빌드된 `dist`가 아니라 원본 `index.html`을 직접 서빙하고 있을 가능성이 큽니다.

권장 설정은 GitHub 저장소 `Settings > Pages > Source: GitHub Actions`입니다.

1.0.2부터는 원본 index가 직접 열려도 HTML fallback이 표시되어 완전한 빈 화면을 방지합니다. 그래도 게임이 시작되지 않으면 `docs/DEPLOYMENT_DIAGNOSIS_1.0.2.md`를 확인하세요.
