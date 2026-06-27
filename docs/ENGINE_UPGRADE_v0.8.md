# CardVille v0.8 Engine Upgrade

## 신규 시스템

## PerformanceSystem

설정값과 기기 상태를 기준으로 애니메이션/파티클 예산을 계산합니다.

- reducedMotion
- dataSaver
- lowPower
- particleCount
- ambientCount

## LayoutSystem

게임 화면 내 안전 영역과 카드 그리드 좌표 계산을 담당합니다.
고정 좌표를 줄이고, 모드별 카드 수 변화에 대응하기 위한 기반입니다.

## VisualSystem

프리미엄 배경, 토스트, 파티클, 카드 이모지 매핑을 담당합니다.
씬마다 반복되던 시각 코드를 공통화하는 시작점입니다.

## 다음 개선 방향

- 실제 WebP 이미지 로더 연결
- Texture Atlas 기반 카드 프레임 연결
- 카드팩 오픈 시 희귀도별 전용 애니메이션
- SceneTransitionSystem 추가
- 오브젝트 풀링 시스템 추가
