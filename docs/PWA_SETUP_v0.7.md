# CardVille PWA Setup v0.7

v0.7부터 기본 PWA 구성이 들어갑니다.

## 포함 파일

```txt
public/manifest.webmanifest
public/sw.js
public/icons/icon-192.png
public/icons/icon-512.png
src/pwa/registerServiceWorker.ts
```

## 동작 방식

- Vite production build에서만 service worker를 등록합니다.
- GitHub Pages 경로 `/CardVille/` 기준으로 캐시합니다.
- 핵심 JSON 데이터는 service worker가 기본 캐시에 넣습니다.

## 주의

- service worker는 배포 후 브라우저 캐시에 남을 수 있습니다.
- 큰 업데이트 후 화면이 안 바뀌면 브라우저 앱 데이터 또는 사이트 캐시를 지워야 할 수 있습니다.
