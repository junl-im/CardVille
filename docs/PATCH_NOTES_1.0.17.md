# CardVille 1.0.17 패치 노트

## 목적
- 모바일/카카오 브라우저에서 모든 화면 양옆에 남는 검은 여백 제거
- 첫 화면, 인트로, 로비, 플레이, 보상, 팝업을 전체 화면 배경으로 표시
- 기존 390x844 UI 좌표는 유지하면서 실제 브라우저 폭은 Phaser EXPAND + responsive camera로 활용

## 적용
- Phaser Scale FIT -> EXPAND 변경
- LayoutSystem에 visibleBounds/applyResponsiveCamera/addCoverImage 추가
- 모든 Scene create 시작 시 responsive camera 적용
- DrawSystem 배경을 전체 visible bounds에 맞게 확장
- Login/Intro 배경 cover 처리
- HTML/CSS app/canvas를 100dvh fixed full viewport로 정리
- check:ui/check:layout에 full-bleed 검증 추가

## 유지
- 게스트 즉시 시작
- 게임 시작 후 인트로 영상 로딩
- 말 카드 스택 플레이
- 뒤로가기 팝업
- SVG 미사용
- Service Worker 캐시 비활성
