# CardVille 1.0.3 Root Deploy Guide

정적 배포 ZIP은 상위 폴더 없이 루트 파일 구조로 압축되어 있다.
압축을 풀었을 때 보이는 모든 파일과 폴더를 GitHub 저장소 루트에 바로 올린다.

올바른 루트 예시:

```txt
index.html
reset.html
health.html
404.html
.nojekyll
assets/
icons/
manifest.webmanifest
sw.js
```

잘못된 예시:

```txt
CardVille_Static_Root_Deploy_1.0.3/index.html
```

검증 순서:

1. https://junl-im.github.io/CardVille/health.html
2. https://junl-im.github.io/CardVille/reset.html
3. https://junl-im.github.io/CardVille/

1번이 404면 Pages 설정 또는 업로드 위치 문제다.
2번만 404면 일부 파일만 올라간 것이다.
3번만 멈추면 JS 번들 또는 브라우저 런타임 문제다.
