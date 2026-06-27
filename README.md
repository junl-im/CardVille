# 카드마을 CardVille v1.0-rc.3

**CardVille**은 꿈의 서고를 배경으로 낱말, 연산, 기억력, 영어, 퍼즐 카드를 플레이하고 수집하는 모바일 카드 퍼즐 게임입니다.

이번 `v1.0-rc.3`은 콘텐츠 추가보다 **상용 서비스 접속 안정성**을 우선한 핫픽스입니다. 사용자가 직접 캐시 초기화 페이지를 열지 않아도, 앱이 자동으로 이전 서비스워커와 오래된 캐시를 정리하도록 변경했습니다.

## 핵심 변경

- 자동 캐시 마이그레이션 추가
- 기존 CardVille 서비스워커 자동 해제
- `cardville-cache-*` 캐시 자동 삭제
- 이전 서비스워커가 남아 있을 때 새 migration worker가 클라이언트를 최신 URL로 자동 이동
- `reset.html`은 수동 복구용 보조 페이지로 유지
- PWA 캐싱은 v1.0-final 전까지 기본 비활성화
- 부팅 fallback 오버레이 안정화
- `check:boot` 검증 강화

## 실행

```bash
npm install --no-audit --no-fund --no-package-lock
npm run dev
```

## 검증

```bash
npm run verify
```

## 배포

GitHub Pages 주소:

```txt
https://junl-im.github.io/CardVille/
```

저장소 루트에는 아래 파일들이 바로 있어야 합니다.

```txt
package.json
src/
public/
firebase/
.github/
index.html
vite.config.ts
```

## 운영 메모

정상 상용 흐름에서는 사용자가 `reset.html`을 직접 열 필요가 없습니다. 단, 과거 캐시가 매우 강하게 남은 일부 브라우저를 위한 고객지원용 복구 주소로 유지합니다.

```txt
https://junl-im.github.io/CardVille/reset.html
```

## 버전

```txt
1.0.0-rc.3
```
