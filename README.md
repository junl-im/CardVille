# CardVille 1.0.9

카드마을 `<CardVille>` 1.0.9는 사용자가 제시한 말 카드형 모바일 게임 구성을 기준으로, 단순 매칭 테스트 화면을 **말 카드 스택 플레이 화면**으로 재구성한 버전입니다.

## 이번 버전 핵심

- CardVille 세계관을 `카드마을` 중심으로 유지
- 플레이 화면을 상단 HUD, 좌측 스텝/보조 패널, 중앙 카드 스택 보드 구조로 변경
- 목표 카드와 같은 계열의 말 카드를 고르는 스택형 규칙 적용
- 카드가 세로로 겹쳐 쌓이는 구조 적용
- 버튼 터치 hitbox를 과도하게 넓히지 않고 보이는 버튼 기준으로 재정렬
- `?touchDebug`로 버튼과 카드의 실제 터치 영역 확인 가능
- 게임 선택을 `말 카드` 중심으로 정리하고 다른 모드는 준비중 처리
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

## 터치 영역 디버그

버튼과 카드가 실제로 어디까지 눌리는지 확인하려면 다음 주소를 사용하세요.

```txt
https://junl-im.github.io/CardVille/?touchDebug
```

## 현재 개발 원칙

1. 접속과 게스트 시작을 최우선으로 유지합니다.
2. CardVille는 `카드마을`과 `말 카드` 중심으로 정리합니다.
3. 플레이 화면은 사용자가 제시한 세로형 카드 스택 게임을 모티브로 발전시킵니다.
4. 대형 에셋, Service Worker, PWA, 인트로 영상은 아직 재도입하지 않습니다.
5. UI는 모바일 세로 화면 기준으로 정확한 터치 영역과 높은 가독성을 우선합니다.
