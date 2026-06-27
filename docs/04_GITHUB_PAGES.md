# GitHub Pages 배포

## 주소

```txt
https://junl-im.github.io/CardVille/
```

## 필수 설정

`vite.config.ts`에 다음 설정이 들어가야 한다.

```ts
export default defineConfig({
  base: '/CardVille/',
});
```

이 설정이 없으면 GitHub Pages에서 JS, CSS, 데이터 JSON 경로가 깨질 수 있다.

## Actions

`.github/workflows/deploy.yml`은 main 브랜치 push 시 자동 실행된다.

저장소 Settings > Pages에서 Source를 `GitHub Actions`로 설정한다.
