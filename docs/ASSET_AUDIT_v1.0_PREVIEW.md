# CardVille v1.0-preview Asset Audit

업로드된 `CardVille_Project_v0.8_AquaGlass_PNG_AssetPack.zip`을 v0.9 프로젝트 위에 적용하면서 검사한 결과입니다.

## 검사 결과

- 전체 public/assets 파일: 6,060개
- 전체 public/assets 용량: 약 101.8MB
- PNG: 5,772개
- WebP: 237개
- MP4: 1개
- JSON: 12개
- SVG: 0개
- 카드 이미지 인덱스: 5,000장
- 카드 이미지 실제 폴더 총량: 5,060개

## 폴더별 주요 수량

- cards_image: 5,060
- icons: 372
- cards: 176
- particles: 85
- buttons: 73
- backgrounds: 72
- effects: 65
- ui: 38
- badges: 28
- packs: 25
- popup: 21
- fonts: 21

## 발견한 문제

업로드 에셋 중 PNG 2개가 손상되어 있었습니다.

- `cards_image/emotions/emotions_2218_졸림.png`
- `cards_image/sea_creatures/sea_creatures_4168_거북.png`

두 파일은 같은 경로를 유지한 채 CardVille 임시 복구 PNG로 교체했습니다. 따라서 `cards_image_index.json` 참조는 깨지지 않습니다.

또한 백업 파일 1개가 있었습니다.

- `cards_image/vegetables/vegetables_0900_상추.png~`

해당 파일은 게임 에셋 규칙에 맞지 않으므로 제거했습니다.

## 적용 방식

5,000장 전체를 시작 시 preload하지 않습니다. 모바일에서는 5,000장을 한 번에 로딩하면 로딩 시간, 메모리, 캐시 용량 문제가 생깁니다.

따라서 v1.0-preview에서는 다음 방식으로 적용했습니다.

1. 카드 이미지 인덱스 JSON만 로딩
2. 게임 기본 카드 48장과 핵심 UI/배경만 preload
3. 카드 이미지 도감에서는 현재 페이지 9장만 lazy-load
4. PWA service worker는 `cards_image` 전체를 강제 캐시하지 않음
5. GitHub Pages 무료 호스팅 기준으로 정적 파일 접근 유지

## 결론

이 에셋팩은 “최종 상용 원화”라기보다는 대형 콘텐츠 구조 검증과 스타일 방향 확인용으로 적합합니다. 그래도 규모는 충분히 큽니다. 5,000장 카드 이미지 인덱스가 들어갔기 때문에, 이제 CardVille은 실제로 대형 수집형 카드 게임 구조를 테스트할 수 있습니다.
