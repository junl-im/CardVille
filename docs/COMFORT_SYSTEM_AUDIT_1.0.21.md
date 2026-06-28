# CardVille 1.0.21 Comfort/System Audit

## UI/UX

- LoginScene의 버튼 세로 간격을 줄여 첫 화면 버튼들이 흩어져 보이지 않게 했습니다.
- 시작 화면은 기존 풀스크린 키아트 흐름을 유지합니다.
- 실제 게임 시작 전 HTML 가짜 버튼은 계속 제거 상태입니다.

## 카드 디자인

- 카드 상단에 카테고리 아이콘을 표시합니다.
- 목표 카드에도 카테고리 아이콘을 표시합니다.
- 카드 본문은 불투명 크림색 카드 스타일을 유지합니다.
- 프레임/shine은 과도하게 튀지 않는 기존 comfort 톤을 유지합니다.

## 연상 판정

- 카드는 category 기반으로 판정합니다.
- 정육면체/큐브/블록은 strong이 아니라 shape 계열로 정리했습니다.
- 오답 시 현재 목표 계열 예시를 함께 보여줍니다.
- check:association이 각 목표별 필요한 정답 카드 수를 검사합니다.

## 피드백

- FeedbackSystem을 추가했습니다.
- 버튼 탭, 정답, 오답, 보상에 선택적인 vibration/audio feedback을 제공합니다.
- 브라우저가 차단하거나 지원하지 않는 경우 조용히 무시합니다.

## 콘텐츠

- 말 카드 스테이지 20개 기준으로 검증합니다.
- 보상 카드풀을 확장했습니다.

## 검증

- npm run verify
- check:deploy
- check:brand
- check:ui
- check:layout
- check:association
- check:security
- check:comfort
