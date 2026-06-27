# CardVille v1.0-preview Patch Notes

## 핵심 목표

v1.0-preview는 업로드된 대형 Aqua Glass PNG 에셋팩을 실제 프로젝트에 통합하고, 디자인/성능/검증/에셋 브라우징 구조를 대규모로 강화한 버전입니다.

## 적용 내용

- 업로드 에셋팩 적용
- 5,000장 카드 이미지 인덱스 연결
- 카드 이미지 도감 신규 추가
- 카드 이미지 페이지 단위 lazy-load 적용
- 실제 배경 PNG를 프리미엄 배경 시스템에 연결
- 카드 등급별 프레임 PNG 연결
- 메인 로비 버튼 배치 재정리
- service worker 캐시 정책 개선
- 손상 PNG 2개 복구
- 백업 확장자 `.png~` 제거
- 에셋 카탈로그 검증 스크립트 추가
- verify 명령 강화

## 신규 장면

- `AssetGalleryScene`

## 신규 시스템

- `AssetCatalogSystem`

## 신규 검증 명령

```bash
npm run check:catalog
```

`npm run verify`에는 다음 검사가 포함됩니다.

```bash
npm run check:imports
npm run check:json
npm run check:assets
npm run check:catalog
npm run build
npm run check:budget
```

## 디자인 개선

- 로비 배경이 실제 `dream_library_day.png`를 사용하도록 개선
- 플레이/보상/설정/앨범 화면도 실제 배경 프리셋 사용
- 카드 프레임 PNG를 카드 UI에 연결
- 메인 로비 메뉴에 `5,000장 이미지 도감` 추가
- 메인 로비 하단 버전 표시 업데이트

## 성능 정책

5,000장 카드 이미지는 한 번에 preload하지 않습니다. `AssetGalleryScene`에서 현재 페이지 9장만 불러옵니다. 모바일 성능과 GitHub Pages 무료 호스팅을 고려한 구조입니다.
