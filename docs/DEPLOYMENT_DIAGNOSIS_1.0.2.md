# CardVille 1.0.2 Deployment Diagnosis

## 현재 의심되는 빈 화면 원인

Vite 프로젝트의 원본 `index.html`은 개발 서버 또는 Vite 빌드를 통해 처리되어야 합니다. GitHub Pages가 저장소 루트를 그대로 서빙하면 브라우저가 `/src/main.ts`를 직접 읽으려고 하며, 이 경우 게임이 시작되지 않습니다.

## 권장 설정

GitHub 저장소에서:

1. Settings
2. Pages
3. Build and deployment
4. Source: GitHub Actions
5. 저장
6. main 브랜치에 push

이후 `.github/workflows/deploy.yml`이 `npm run verify`와 `vite build`를 실행하고, `dist`를 GitHub Pages에 배포합니다.

## 대체 방법

GitHub Pages를 branch/root 방식으로만 쓸 경우, 소스 프로젝트가 아니라 정적 배포 ZIP의 내용물을 루트에 올려야 합니다.

정적 배포 ZIP은 `dist` 폴더 안의 최종 HTML/JS/CSS/assets만 들어있는 패키지입니다.

## 1.0.2 안전장치

- 원본 index.html이 직접 열려도 더 이상 완전한 빈 화면만 나오지 않도록 HTML fallback 추가
- 3.2초 후 자동으로 배포 설정/캐시 문제 안내
- 8.5초 후 원본 index 직접 배포 가능성 안내
- `reset.html`은 비상 복구용으로 유지
