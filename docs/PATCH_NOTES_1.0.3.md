# CardVille 1.0.3 - Root Deployment Diagnosis Patch

## 핵심 수정
- 정적 배포 ZIP을 루트 파일 구조로 제공하도록 변경
- health.html 추가
- 404.html 추가
- index.html에서 필수 배포 파일 존재 여부 자동 검사
- reset.html 404 여부를 화면에 표시
- GitHub Pages branch/root 배포 시 누락 파일 문제를 빠르게 식별

## 가장 중요한 확인
배포 후 아래 주소가 열려야 한다.

- /CardVille/health.html
- /CardVille/reset.html
- /CardVille/assets/index-*.js

health.html 또는 reset.html이 404라면 게임 코드 문제가 아니라 배포 파일이 루트에 제대로 올라가지 않은 것이다.
