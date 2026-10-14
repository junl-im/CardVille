# 라니팡 v0.9.1 — Android 지도 터치 및 탐색 복구 (2026-10-14)

## 사용자 보고와 증거
실제 안드로이드 화면(360px 상당 모바일 뷰)의 게임판 아래에 아이템, '단계 편집기', '오늘의 도전', '난이도', '2인 대전'이 보이며 지도 버튼 접근이 어렵거나 탭 후 반응이 없다고 보고됨. 이 증거만으로 실제 Android 기기의 단일 근본 원인을 단정하지 않음.

## 확인된 문제
- 지도 버튼이 상단에만 위치해 게임 본문 아래로 스크롤한 상태에서 찾기 어려웠음.
- 지도 단계 버튼의 무한 부유 CSS 애니메이션 때문에 자동 브라우저 클릭 검사가 'element is not stable'로 실패했음. 애니메이션을 제거한 후 실제 클릭 성공을 확인.
- 지역 탭 전환 시 스크롤하려던 `#lany-map-section`은 존재하지 않았으며 올바른 `.lany-map-section` 선택자로 보완함.
- 음악 토글이 ON 상태를 연속 두 번 반전하던 오류 수정.

## v0.9.1 구현
- 상단 고정 게임 헤더 + 지도 버튼 직접 `LanyShell.openMap()` 연동.
- 게임판·아이템 영역 아래 52px 이상 `🗺️ 모험 지도 열기` 버튼과 일시정지 버튼 추가.
- 단계 터치 대상의 계속 이동하는 애니메이션 제거, 터치/접근성 초점 개선.
- 이미지, JS, CSS 요청의 v0.9.1 캐시 갱신, 서비스워커 이름 변경.
- 기존 250단계·게임 진행 기록 (`sc_unlocked`, `sc_stars`, `sc_best`, `cv_last_level`) 보존.
- 배포 HTTP 스모크 검사에 새로운 지도 버튼 마커와 지도 코드 확인 추가.

## 실제 검증
- Node 정적·안전 회귀 검사 9종 통과.
- 모바일 360×780 touch API, 데스크톱 1366×768 자동 브라우저 검사에서 하단 지도 버튼 → 모험 지도 → 퍼즐로 복귀, 상단 지도 버튼 → 지도, 1단계 버튼 → 준비창, 진행 중 퍼즐판 보존 모두 통과. JavaScript 예외 0건.
- [GitHub Pages 성공](https://github.com/junl-im/CardVille/actions/runs/38487644839).
- [Firebase Hosting preview 실제 성공](https://github.com/junl-im/CardVille/actions/runs/38487676412): `Preview HTTP smoke test: PASS`.
- [게임 URL](https://cardville--cardville-match3-preview-ikhmalki.web.app/?v=0.9.1).
- **한계:** 실제 사용자 Android 디바이스 물리 터치 입력과 캐시 조건의 수동 확인은 아직 필요. 기존 Firebase live 미변경.
