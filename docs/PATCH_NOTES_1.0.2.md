# CardVille 1.0.2 Patch Notes

## 핵심 수정

- 첫 화면 빈 화면 방지용 HTML inline fallback 추가
- GitHub Pages가 Vite 원본 index.html을 직접 서빙하는 경우에도 안내 화면 표시
- 배포 모드 검사 스크립트 추가: `npm run check:deploy`
- `npm run verify`에 배포 모드 검사 포함
- 카카오 브라우저에서 초기 `history.pushState`를 건너뛰도록 수정
- 카카오 브라우저 부팅 중 히스토리 가드가 게임 시작을 막지 않도록 변경
- GameButton 터치 히트박스 확장
- 버튼 시각 영역과 터치 영역 불일치 완화
- 버전 표기 1.0.2로 정리

## 가장 중요한 배포 진단

`https://junl-im.github.io/CardVille/`에서 완전 빈 화면이 나오고, HTML fallback조차 보이지 않는다면 GitHub Pages가 아직 새 배포물을 받지 못했거나 브라우저/앱 캐시가 이전 HTML을 붙잡고 있는 상태입니다.

HTML fallback이 보이지만 게임이 시작되지 않는다면, GitHub Pages가 빌드된 `dist`가 아니라 저장소 원본 `index.html`을 직접 서빙하고 있을 가능성이 큽니다. Pages Source를 `GitHub Actions`로 설정하거나 정적 배포 ZIP의 내용을 Pages 루트에 배포해야 합니다.
