# 라니팡 v1.1 — 실제 게임 아트·반응 연동

- 구현: 기본 7종 퍼즐 얼굴은 기존 유지. 별도 8종 표정 4종씩(32 WebP)은 손가락 터치/마우스 드래그/3개 이상 매치 순간 JS에 연결.
- 진짜 동작: pointerdown 캐릭터 윙크와 눌림, 유효한 매치에서 웃음·환호와 반짝임 VFX, 승리·패배 시 캐릭터 일러스트. 버튼은 실 HTML 텍스트를 유지한 젤리 그라데이션으로 누르는 애니메이션 적용.
- 팝업: 승리, 패배, 일시정지, 종료, 단계 준비, 도감, HUD, 지도, 아이템 버튼에 통일된 크림/핑크/그린/블루 스타일. 최소화된 CSS 전용 인터랙션이며 기존 onclick과 키보드 지원 보존.
- 배경: 새 오리지널 게임 마을/game-meadow.webp 및 지도/world-map.webp, 모바일 파일 크기로 줄임.
- 안전: 기존 localStorage 진행 키 sc_unlocked/sc_best/sc_stars/cv_last_level 보존, 250단계/10지역/7종 퍼즐 타입 유지, Pointer event는 capture listen only이고 stopPropagation/preventDefault 미사용, 우클릭 드래그 허용하지 않음.
- 한계: generated sheet에서 자른 효과/표정 에셋은 후속 개별 원화 정리 필요. 사용자 제공 원본을 별도 보존. 삼성 인터넷 실제 단말 E2E는 미검증.
- Firebase 미리보기와 운영 live는 분리: 사용자가 이미 접속하는 실제 GitHub Pages 게임을 배포 우선 대상으로 사용.
