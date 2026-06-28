# CardVille 1.0.19

카드마을 `<CardVille>` 1.0.19은 전체 화면을 더 적극적으로 쓰는 반응형 플레이필드, 카드 낙하/정답 연출, 콘텐츠 확장, Firebase CDN 지연 로딩, UI/UX 검증을 강화한 업데이트입니다.

## 이번 버전 핵심

- 플레이 화면 카드 보드가 실제 브라우저 폭을 더 활용하도록 개선
- 좌측 스텝/힌트/셔플 패널과 카드 보드의 겹침 가능성 축소
- 목표 카드 영역을 보드 폭에 맞게 넓게 재배치
- 카드 스택 재정렬 시 짧은 낙하/settle 애니메이션 추가
- 정답 시 sparkle 효과 추가
- 카드 프레임/shine 투명도를 낮춰 눈이 편한 카드 스타일 유지
- 말 카드 스테이지 12개 → 16개 확장
- 보상 카드풀 확장
- Firebase npm 의존성 제거, Google/Email 버튼 클릭 시 CDN 지연 로딩
- npm install 및 GitHub Actions 설치 부담 감소
- SVG 사용 금지, Service Worker/PWA 캐시 비활성 유지

## 실행 흐름

```txt
접속
→ 풀스크린 시작 화면
→ 게임 시작 / 로그인 선택
→ 인트로 영상 + 게임 에셋 로딩
→ 카드마을 광장
→ 말 카드 스테이지
→ 말 카드 스택 플레이
→ 결과 / 카드팩 보상 / 앨범
```

## 개발 실행

```bash
npm install --no-audit --no-fund --no-package-lock
npm run dev
```

## 검증

```bash
npm run verify
```

검증 항목:

```txt
npm run build
npm run check:deploy
npm run check:brand
npm run check:ui
npm run check:layout
```

## 배포

GitHub Pages 설정:

```txt
Settings
→ Pages
→ Source: GitHub Actions
```

배포 후 확인:

```txt
https://junl-im.github.io/CardVille/health.html
https://junl-im.github.io/CardVille/deploy-proof.html
https://junl-im.github.io/CardVille/version.json
https://junl-im.github.io/CardVille/
```

## 에셋 정책

- SVG 사용 금지
- PNG / WebP / MP4 사용
- 대형 카드 이미지 전체 강제 preload 금지
- 시작 화면은 가볍게 유지
- 게임 리소스는 게임 시작 후 인트로 영상 중 단계적으로 로딩
