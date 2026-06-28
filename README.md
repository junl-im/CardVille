# CardVille 1.0.15

카드마을 `<CardVille>` 1.0.15는 1.0.14의 정상 실행 구조를 유지하면서, 첫 로그인 화면을 더 꽉 찬 플레이 화면처럼 보이게 만들고 카드/패널의 과한 투명감을 줄인 UI/UX 안정화 버전입니다.

## 이번 버전 핵심

- 첫 로그인 화면 풀스크린 키아트 중심 재배치
- 시작 버튼을 이미지 위에 자연스럽게 얹는 하단 컨트롤 구조 적용
- 카드 앞면/목표 카드/보드 레일을 더 불투명하고 눈 편한 톤으로 변경
- 카드 프레임은 장식으로만 사용하고 카드 본문은 단단한 크림색으로 고정
- 좌측 패널과 HUD 투명도 축소, 글자 가독성 강화
- 버튼 PNG를 텍스트 없는 plain 버튼으로 교체해 글자 겹침 제거
- SVG 미사용 유지
- Service Worker/PWA 캐시 비활성 유지
- GitHub Actions 배포 구조 유지

## 실행

```bash
npm install --no-audit --no-fund --no-package-lock
npm run verify
```

## 배포

GitHub Pages 설정은 아래 방식 권장입니다.

```txt
Settings → Pages → Source: GitHub Actions
```

배포 후 확인:

```txt
https://junl-im.github.io/CardVille/health.html
https://junl-im.github.io/CardVille/deploy-proof.html
https://junl-im.github.io/CardVille/
```

## 주의

1.0.15는 대형 카드 이미지 5000장을 한 번에 강제 연결하지 않습니다. 실행 안정성을 유지하면서 배경, 버튼, 카드 프레임, 카드팩, 파티클 중심으로 점진 적용합니다.
