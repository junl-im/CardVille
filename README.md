# CardVille 1.0.20

카드마을 `<CardVille>` 1.0.20은 전체 화면을 더 적극적으로 쓰는 반응형 플레이필드, 카드 낙하/정답 연출, 콘텐츠 확장, Firebase CDN 지연 로딩, UI/UX 검증을 강화한 업데이트입니다.

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


## 1.0.20 업데이트

- 첫 접속 시 잠깐 보이던 HTML 가짜 `게임 시작` 버튼 제거
- 실제 시작 버튼은 Phaser LoginScene 준비 후에만 표시
- 로그인 화면 버튼 간격을 더 촘촘하게 정리
- 휴대폰 뒤로가기 팝업을 DOM overlay + Phaser fallback으로 보강
- `정육면체` 연상을 `강함`이 아닌 `모양/도형`으로 수정
- 스테이지 목표별 정답 카드 수 검사 추가
- localStorage 저장값/이메일 입력값 검증 강화
- 카드 앞면 디자인을 더 불투명하고 눈 편한 스타일로 개선
