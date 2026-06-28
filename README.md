# CardVille 1.0.7

카드마을 `<CardVille>` 1.0.7은 실행 성공 이후 발견된 **글자 가독성 / UI 대비 / 버튼 터치 영역** 문제를 고친 안정화 패치입니다.

## 이번 버전 핵심

- 한국어 폰트 스택 적용
- 모든 주요 텍스트에 stroke / shadow 적용
- 글래스 패널 대비 강화
- 배경 명도 조정
- 버튼 라벨 가독성 강화
- 버튼 터치 hitbox 확대
- 카드 앞면 / 보상 / 앨범 텍스트 대비 강화
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

## GitHub Actions 배포

GitHub Pages 설정은 `GitHub Actions`를 사용하세요.

배포 후 확인 주소:

- https://junl-im.github.io/CardVille/
- https://junl-im.github.io/CardVille/health.html
- https://junl-im.github.io/CardVille/deploy-proof.html
- https://junl-im.github.io/CardVille/version.json

## 현재 개발 원칙

1. 접속과 게스트 시작을 최우선으로 유지합니다.
2. 디자인은 가독성 안정화 후 단계적으로 고급화합니다.
3. 대형 에셋, Service Worker, PWA, 인트로 영상은 아직 재도입하지 않습니다.
4. UI는 모바일 세로 화면 기준으로 큰 터치 영역을 우선합니다.
