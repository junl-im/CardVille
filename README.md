# CardVille 1.0.13

카드마을 `<CardVille>` 1.0.13은 1.0.12의 정상 실행 구조를 유지하면서, 모바일 세로 화면의 좌우 여백을 더 활용하고 기존 AquaGlass PNG/WebP 에셋을 안전하게 재도입한 UI/UX·디자인 업그레이드 버전입니다.

## 이번 버전 핵심

- 게임 화면 카드 보드 폭 확대
- 좌측 스텝/힌트 패널 슬림화
- 말 카드 크기 확대 및 가독성 강화
- 목표 카드 영역 확장
- 카드마을 배경에 기존 PNG 에셋 재도입
- 코인, 별, 설정, 게임 모드, 카드팩, 앨범 아이콘 에셋 적용
- 카드 뒷면과 희귀도 프레임 에셋 일부 적용
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

1.0.13은 대형 카드 이미지 5000장을 한 번에 다시 연결하지 않았습니다. 실행 안정성을 유지하기 위해 배경/아이콘/카드프레임/카드백 같은 작고 안정적인 PNG 에셋부터 적용했습니다.
