# 라니팡 v2.2 — SVG 완전 퇴출 및 게임 전용 래스터 UI 품질 복구

## 2026-10-14 기준 확인
- 노션 MASTER, 「v2.1 실제 UI 이미지 패치」, 구글드라이브 개발 기획과 원본 20종 아트 보관 기록을 확인.
- GitHub `main`은 v2.1.0-beta였으며 SVG 원본 **29개가 배포 대상 `web/`에 남아 있었음**.
- 레거시 UI: `lany-action-art-v16.css`가 SVG 12개 기능 아이콘 + SVG 4개 지도 단계 표식을 선언. `lany-worlds-v20.css`는 WebP로 다시 덮어씀. `lany-title-stage-v17.css`는 실제 원본 WebP를 사용하는 v1.8 덮어쓰기 아래에서도 SVG 배경 주소를 남김.
- 지도 경로: `lany-shell.js`가 실행마다 DOM 기반 SVG 요소를 생성.
- PWA/파비콘: manifest + HTML이 PNG와 SVG를 동시에 참조했고 `build-pwa-icons.py`가 SVG 원본을 사용.
- 3개 참고 화면의 주요 장점은 한눈에 읽히는 점수·이동·진행 게이지, 전용 그림 버튼, 아이템 기능별 명확한 배색.

## 실제 반영
1. `web/assets/**/*.svg` 및 `web/assets/lanypang-*.svg` **29개 삭제**. Git 이전 커밋은 역사 기록으로 남으며 별도로 변경/재작성하지 않음.
2. HTML, CSS, manifest, SW의 SVG 리소스 주소 전부 제거. 이미 승인된 WebP(지도 4종, UI 51종 등)와 PNG PWA 마스코트만 남김.
3. 지도 경로는 Canvas 2D로 재설계. 단계 길을 따라 2색 캔디 선 + 그림자, DPR 2까지 제한, 페이지마다 캔버스 크기 재설정. 단계 버튼은 `stage-*-v20.webp` 4종.
4. PWA 자동 아이콘 빌드: PNG 512px 원본 + Pillow 리샘플링, Apple Touch 및 maskable PNG 생성. 벡터 렌더러 의존성 제거.
5. 게임 화면: Score / Moves 상단 HUD를 통일된 WebP 패널에 배치, 중복되는 단계/최고점수 HUD는 화면에서 줄이되 데이터 원본 유지.
6. 3개 별 게이지의 실제 보상 기준: 목표 100%, 140%, 200%. 진행바는 2배 목표를 100%로 사용해 별 표시와 실제 획득 조건이 모순되지 않도록 수정.
7. 4개 부스터 WebP 패널, 버튼 눌림, 지도 지역·단계·페이지 화살표 디자인을 `lany-raster-only-v22.css`로 한 곳에 통합.
8. 기존 저장 `sc_unlocked`, `sc_best`, `sc_stars`, 250스테이지, 타이머, 콤보, 인게임 입력 처리 변경 없음.

## 재발 방지
- `tools/check-raster-only-v22.cjs`는 **배포 디렉터리 `web/` 내 SVG 확장자 파일, CSS/HTML/JS/manifest의 참조, 런타임 SVG DOM 생성**을 금지. 4개 주요 CI 파이프라인 모두 적용.
- `tests/verify-raster-v22.py`: 320×440, 320×568, 390×844, 1366×768 실제 Chromium 검사. SVG DOM/네트워크 요청 0, Canvas 지도, 클릭/단계 선택, WebP 아이템, 이동 횟수, 점수별 1~3별 실제 상태, 게임 화면 스크린샷.
- 정적 검사 및 브라우저 검사가 통과하지 않으면 병합/배포 진행하지 않음.
- Git 원본 아트 및 노션/Drive 기록 삭제·변경 없음. PNG 20종 ASSET MASTER 원본 보관 유지.
- 실기기 GPU 성능·화풍 만족도·픽셀 단위 실사용 화면은 최종 모바일 확인 권장.
