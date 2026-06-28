# CardVille 1.0.8

카드마을 `<CardVille>` 1.0.8은 실행 성공 이후 발견된 **버튼 터치 매핑 불안정**, **잘못 남아 있던 임시 세계관 문구**, **CardVille 브랜드 흐름 혼선**을 정리한 UI/UX 안정화 패치입니다.

## 이번 버전 핵심

- 이전 임시 세계관 잔여 문구 제거
- 메인 흐름을 `카드마을 광장 → 게임 선택 → 스테이지 선택 → 플레이`로 정리
- `낱말의 책` 같은 책 콘셉트명을 `낱말 카드`처럼 CardVille에 맞게 변경
- 버튼 터치 판정을 내부 `Zone` 방식으로 재구성
- 보이는 버튼보다 실제 터치 영역을 더 크게 확장
- `?touchDebug`로 버튼 터치 영역을 화면에서 확인 가능
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

버튼이 실제로 어디까지 눌리는지 확인하려면 다음 주소를 사용하세요.

```txt
https://junl-im.github.io/CardVille/?touchDebug
```

## 현재 개발 원칙

1. 접속과 게스트 시작을 최우선으로 유지합니다.
2. CardVille 세계관은 `카드마을` 기준으로 유지합니다.
3. 디자인은 가독성 안정화 후 단계적으로 고급화합니다.
4. 대형 에셋, Service Worker, PWA, 인트로 영상은 아직 재도입하지 않습니다.
5. UI는 모바일 세로 화면 기준으로 큰 터치 영역을 우선합니다.
