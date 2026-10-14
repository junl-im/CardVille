# 라니팡 v2.1 — 실제 적용 패치: 스프라이트 원본과 51개 게임 UI 이미지

## 소스 기준
- GitHub: `junl-im/CardVille`, v2.0.0-beta 기준으로 v2.1 패치.
- 노션 MASTER: 라니팡 프로젝트 설계·진행 기준본.
- Drive: PROJECT MATCH — 애니팡형 웹게임 폴더.
- **사용자가 승인한 실제 이미지**: `web/assets/ui/v21/source-original-kit.zip` — 제공한 투명 배경 디자인 시트 `라니팡_귀여운_게임_ui_버튼_세트.png`에서 분리한 **20개 고품질 WebP** + 잘라낸 영역과 SHA256.
- 바이너리 원본은 GitHub Git blob으로 보관, GitHub Actions 빌드에서 풀어서 사용.

## 실제 연결
1. 첫 화면 게임 시작 = 기존 텍스트/CSS 임시 그림이 아닌 `start_main.webp` 원본으로 교체.
2. 게임 방법 = `help.webp` 원본, 친구 도감 = `friends.webp` 원본. 원본에 이미 글자가 있으므로 중복 HTML 시각 레이블은 숨기고 접근성 `aria-label`은 유지.
3. 앱 설치 버튼 = 사용자 이전 요청인 **검은 고양이**를 지키기 위해 원래 검은 고양이가 포함된 WebP 사용. 원본 아트시트의 토끼 설치 버튼은 별도 원본 ZIP 안에 보존, 실제 설치 버튼으로 덮어쓰지 않음.
4. 타이틀 로고 = 승인된 기존 라니팡 WebP.
5. 게임 전반: `web/assets/ui/v21` 폴더에 독립 WebP 51종 생성.
   - title 5종
   - buttons 23종 (기본 스킨 6종, 실제 기능 이미지 17종)
   - popup 8종
   - hud 7종
   - map 4종
   - booster 4종
6. `web/css/lany-ui-v21.css`가 전체 게임에 적용되며 지도·준비창·결과창·도감·설치안내·HUD·부스터·게임 메뉴까지 전용 WebP 스킨 활용.
7. CSS transform/opacity 기반 입력 반응, 접근성 label, 모바일 320px 화면 대응 및 효과 축소 유지.
8. v2.1 버전, manifest, PWA precache에 51개 생성 이미지를 등록. 저장 기록, 250스테이지, 타임 모드 로직 변경 없음.

## 배포 게이트
- `tools/build-visual-v18.py`는 v2.1 이미지 생성까지 확대.
- `tools/check-ui-v21.cjs`: 원본 ZIP 존재, 51개 리소스 경로, 버전 일치, WebP signature/파일 크기 검사.
- `tests/verify-ui-v21.py`: 320×568, 390×844, 320×440, 1366×768에서 실제 이미지 로딩, 제목 버튼, 지도, 단계 준비, 퍼즐 64개 셀, 일시정지, 승패 다이얼로그 렌더 검사와 스크린샷.
- GitHub Pages, Firebase preview, Firebase LIVE 액션 모두 동일 빌드·검사를 통과해야 배포.
- 실제 휴대폰에서의 열·FPS 측정 및 디자인 픽셀 단위 완성도는 별도 수동 점검 대상. `?perf=1` 로 검사 가능.

## 다음 업데이트에 대비한 원본 보존
- GitHub: `web/assets/ui/v21/source-original-kit.zip`
- 구글 드라이브: `PROJECT MATCH — 애니팡형 웹게임/LanyPang_v2_1_Original_Art_Kit.zip`
- 개별 파일별 SHA256 및 PNG 소스의 SHA256는 ZIP 안 `MANIFEST.json` 참고.
