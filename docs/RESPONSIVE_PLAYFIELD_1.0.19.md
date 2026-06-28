# Responsive Playfield Audit 1.0.19

## 목적

1.0.17에서 검은 여백을 제거했지만, 플레이 보드는 여전히 기존 390px 좌표계에 가까웠습니다. 1.0.19는 실제 visible bounds를 사용해 플레이필드가 넓은 화면을 더 활용하도록 개선했습니다.

## 변경점

- `LayoutSystem.playArea()` 추가
- `distributeColumns()` 추가
- `PlayScene.boardLayout()`이 고정 x좌표 대신 visible bounds 기반 좌표를 사용
- 목표 영역, 좌측 패널, 카드 레일이 현재 viewport 폭을 기준으로 배치
- 카드 크기는 화면 폭에 따라 78~92px 범위에서 자동 조정

## 안전장치

- 버튼/카드 hitArea는 카드 시각 크기 근처로 제한
- 중앙 safe layout은 유지해 기존 씬 흐름이 무너지지 않도록 함
- `?touchDebug` 유지
- `check:layout`에서 responsive playfield 관련 토큰 확인
