# Full Bleed Layout 1.0.17

## 문제
기존 Phaser FIT 모드는 390x844 기준을 부모 영역 안에 맞추기 때문에, 카카오 브라우저처럼 실제 viewport가 더 넓고 짧게 잡히면 좌우 검은 여백이 발생했다.

## 해결
Phaser Scale.EXPAND를 사용해 canvas visible area를 부모 전체로 확장하고, 카메라 scroll을 중앙 보정한다. 기존 390x844 UI는 중앙 안전 영역에 유지하고 배경/오버레이는 visible bounds 전체로 그린다.

## 검증 포인트
- /CardVille/ 첫 화면 좌우 검은 여백 없음
- /CardVille/?touchDebug에서 버튼 터치 영역 유지
- 인트로 영상은 object-fit cover 유지
- 플레이 화면 UI는 중앙 safe area에 유지되고 배경은 전체 폭 사용
