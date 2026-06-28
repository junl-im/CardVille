# CardVille 1.0.11

카드마을 `<CardVille>` 1.0.11은 실행이 안정화된 1.0.10을 기준으로, **UI/UX 배치, 모바일 세로 화면, 말 카드 스택 시스템, 콘텐츠, 디자인 안전성**을 확장한 버전입니다.

## 이번 버전 핵심

- CardVille 세계관은 `카드마을`과 `말 카드` 중심으로 유지
- 모바일 세로 390×844 기준 UI 배치 재정리
- 상단 HUD, 좌측 스텝/힌트/셔플, 중앙 목표 카드, 중앙 카드 스택 보드 구조 유지
- 카드마을 배경을 귀여운 캐주얼 2.5D 느낌으로 강화
- SVG 사용 금지 정책 유지, Phaser Graphics 기반 장식 사용
- 말 카드 스테이지 4개에서 8개로 확장
- 스테이지 잠금/해금 구조 추가
- 스테이지 선택 화면 페이지 구조 추가
- 힌트/셔플/콤보/보너스 미터 유지 및 보정
- 보상 카드풀 확장, 희귀도 시스템 추가
- 카드 앨범 페이지 구조 추가
- 터치 영역은 보이는 카드/버튼과 최대한 일치하도록 유지
- `?touchDebug`로 버튼과 카드의 실제 터치 영역 확인 가능
- 게스트는 서버 접속 없이 localStorage로 즉시 시작
- Google / 이메일 버튼을 눌렀을 때만 Firebase 동적 로딩
- Service Worker / PWA 캐시는 계속 비활성화

## 실행

```bash
npm install
npm run dev
```

## 검증

```bash
npm run verify
```

검증 항목:

- TypeScript 빌드
- Vite 프로덕션 빌드
- GitHub Pages `/CardVille/` base 경로 확인
- CardVille 브랜드 금칙어 확인
- UI/콘텐츠 필수 파일 확인
- 말 카드 스테이지 최소 8개 확인
- SVG 파일 0개 확인

## GitHub Actions 배포

GitHub Pages 설정은 `GitHub Actions`를 사용하세요.

배포 후 확인 주소:

- https://junl-im.github.io/CardVille/
- https://junl-im.github.io/CardVille/health.html
- https://junl-im.github.io/CardVille/deploy-proof.html
- https://junl-im.github.io/CardVille/version.json

## 터치 영역 디버그

버튼과 카드가 실제로 어디까지 눌리는지 확인하려면 다음 주소를 사용하세요.

```txt
https://junl-im.github.io/CardVille/?touchDebug
```

## 현재 개발 원칙

1. 접속과 게스트 시작을 최우선으로 유지합니다.
2. 정상 작동하는 부팅/로그인/게스트/스테이지 흐름은 건드릴 때마다 검증합니다.
3. CardVille는 `카드마을`과 `말 카드` 중심으로 정리합니다.
4. 플레이 화면은 사용자가 제시한 세로형 카드 스택 게임을 모티브로 발전시킵니다.
5. SVG는 사용하지 않습니다.
6. 대형 에셋, Service Worker, PWA, 인트로 영상은 안정화 후 단계적으로 재도입합니다.
7. UI는 모바일 세로 화면 기준으로 정확한 터치 영역과 높은 가독성을 우선합니다.
