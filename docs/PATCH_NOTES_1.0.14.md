# CardVille 1.0.14 Patch Notes

## 핵심 목표
- 작동 중인 1.0.13 흐름을 유지하면서 모바일 세로 화면의 좌우 여백을 더 적극적으로 사용한다.
- 귀여운 캐주얼 2.5D 카드게임 느낌을 강화한다.
- 에셋팩의 PNG 리소스를 실제 UI/보상/효과에 더 연결한다.
- 게임 시스템, 콘텐츠, 성능 검증을 함께 확장한다.

## UI/UX
- 플레이 화면 좌측 보조 패널을 더 얇게 만들고 카드 보드 폭을 확장했다.
- 카드 컬럼 x 좌표를 재배치하여 실제 390px 세로 화면에서 더 넓게 사용한다.
- 목표 카드 영역도 316px 폭으로 확장했다.
- HUD에 트로피/콤보 아이콘을 연결했다.
- 버튼은 기존 Graphics 기반 디자인을 유지하되 PNG 버튼 스킨이 있으면 우선 사용한다.

## 에셋 적용
- 버튼 스킨: large/medium/small normal/press.
- 카드팩: common/rare/epic/legendary closed/opening/open.
- 효과: correct/wrong/shine/aura.
- 파티클: star/sparkle.
- 배지: open/new.
- 아이콘: trophy/combo/home/shop/gift.

## 게임 시스템
- 보상 화면을 카드팩 오픈 방식으로 변경했다.
- 카드팩을 터치하면 opening_01 → opening_02 → open 순서로 열리고 보상 카드가 등장한다.
- 보상 카드는 기존처럼 localStorage 컬렉션에 저장된다.
- 보상 연출에는 스파클 파티클과 희귀도 글로우가 들어간다.

## 콘텐츠
- 말 카드 스테이지를 8개에서 12개로 확장했다.
- 신규 스테이지: 고양이 상점가, 별빛 카드축제, 숲속 카드길, 카드마을 챔피언전.

## 검증
- check:layout 추가.
- pack opening, 2.5D UI, 버튼 스킨, 필수 에셋 존재를 검사한다.
- SVG 사용 금지 유지.
