# CardVille v0.9 Asset Seed Pack

## 목적

v0.9의 시드 에셋은 최종 상용 에셋이 아니라, UI 배치, 이미지 로딩, WebP/PNG 파이프라인, 컬렉션 화면, 카드팩 화면을 실제 이미지 기반으로 점검하기 위한 기준 에셋이다.

## 생성 수량

- PNG/WebP 래스터 에셋: 329개
- 로딩 인트로 MP4: 1개
- SVG: 0개

## 포함 범위

- backgrounds
- cards/frames
- cards/backs
- cards/shine
- cards/shadows
- icons
- buttons
- popup
- particles
- effects
- packs
- badges
- ui
- fonts
- cards_image
- video

## 최종 제작 규칙

- 원본은 1024x1024 이상
- 게임 적용은 WebP/PNG
- 좌상단 광원
- 우하단 그림자
- 지나치게 평면적인 초등 교육 앱 스타일 금지
- 과한 검은 외곽선 금지
- 채도는 부드럽고 고급스럽게 유지
- SVG 사용 금지

## 교체 방식

동일한 파일 경로와 이름으로 최종 AI 이미지를 덮어쓰면 코드 수정 없이 교체된다.

예시:

`public/assets/cards_image/fruits/apple_001.webp`

이 파일을 최종 사과 일러스트 WebP로 교체하면 CardView, CollectionScene, RewardScene에 자동 반영된다.
