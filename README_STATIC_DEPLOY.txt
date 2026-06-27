CardVille 1.0.2 Static Deploy Package

이 폴더는 Vite 빌드 결과물(dist)입니다.
GitHub Pages를 branch/root 방식으로 사용할 때는 이 폴더 안의 파일들을 Pages 루트에 올려야 합니다.

권장 방식은 여전히 GitHub 저장소 Settings > Pages > Source: GitHub Actions 입니다.
그 설정을 쓰면 소스 프로젝트 ZIP을 올리고 push하는 것만으로 자동 배포됩니다.

정적 배포 방식 사용 시 이 폴더의 index.html, assets, sw.js, reset.html, build.json, public assets가 /CardVille/ 루트에 위치해야 합니다.
