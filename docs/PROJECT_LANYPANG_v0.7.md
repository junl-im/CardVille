# 라니팡! v0.7 — 공식 브랜드, 첫 화면, 뒤로가기, 전체화면

## 실제 적용 범위
- 공식 게임명 **라니팡**. 영문 로마자 표기 LanyPang은 내부 문서·저장 패키지에서만 사용. 기존 Github 저장소 junl-im/CardVille와 Firebase 프로젝트 ID cardville은 유지.
- 원본 AI 제작 3D 동화풍 마을 일러스트를 WebP 768×1152로 압축하여 `web/assets/lanypang-cover.webp`에 저장, CSS로 **진짜 첫 화면 배경**으로 사용. 기존 상용 애니팡 캐릭터·음악·UI 이미지 불포함.
- 접속 순서: 타이틀(라니팡 로고·게임 시작·게임 방법·전체 화면) → 버튼 클릭시 게임 보드 생성/레벨 이어하기. 최초에는 튜토리얼을 강제로 띄우지 않음.
- 게임 메뉴 → 계속하기/게임 방법/처음 화면으로/나가기. Android 뒤로가기(history.popstate) → **게임 내 종료 확인창**. Escape도 모바일 뒤로가기 대체 동작. 이 기능은 호스트 브라우저가 history popstate를 보낼 때 작동하며 WebView별로 한계가 있음.
- Chrome 등 Fullscreen API가 있으면 시작 버튼 유저 제스처로 전체 화면 요청. 실패·미지원 시 정상 웹 게임으로 계속. 화면에 항상 독립 전체 화면 버튼 있음. iOS Safari, 카카오톡 인앱 브라우저는 전면 화면 보장 불가.
- 브라우저 스크립트가 일반 사용자가 연 탭을 강제로 닫지 못하므로 **'나가기'는 첫 화면으로 이동**(정직한 안전 폴백). 페이지 이탈은 사용자의 브라우저 뒤로/탭 닫기로 함.
- 클릭 두 번 블록 교환과 우클릭 기본 메뉴는 기존 v0.6에서 금지했고, 이 규칙 유지. PC 드래그·모바일 스와이프 사용.
- 250개 스테이지, 레벨별 기록 및 로컬 저장 키(sc_best/sc_stars/sc_unlocked/cv_last_level)를 변경하지 않음. 일시정지나 첫 화면으로 이동은 **진행 중 퍼즐판 상태까지 영구 저장하는 기능은 아님**.
- 1회성 앱 설치용 웹 매니페스트 이름도 '라니팡!'으로 변경. Firebase live 채널은 보호, preview 검증 후 실제 운영 배포 판단.

## 실제 검증
- `node tools/check-release.cjs`, `check-korean-ui.cjs`, `check-korean-complete.cjs`, `check-lany-shell.cjs`, `check-firebase-preview.cjs`.
- `python tests/verify-shell.py`: PC 1366×768, 모바일 390×844, 최초 튜토리얼 숨김, 한글 도움말, 게임 시작 후 64타일, 메뉴, 종료 확인, 뒤로가기, 홈 복귀, 페이지 JavaScript 예외 0. 로컬 Chrome 격리 검증임.
- `test-gameplay.py` 별도 추가로 유효한 drag 매치, 점수 및 이동수 갱신을 검사.
- 웹 앱·폰 브라우저별 실제 뒤로가기 동작은 실제 기기 테스트 필요.

## 기존 영어 게임이 보이는 원인 구분
- 예전 CardVille **Firebase live 사이트**와 `cardville--cardville-match3-preview-*.web.app` **미리보기 채널**은 서로 다른 배포 대상. 기존 live는 과거 지침대로 덮어쓰지 않았으므로 영어가 보일 수 있음.
- Service Worker의 구 버전 캐시는 이전 파일을 표시할 수 있음. v0.7은 새 캐시 키를 사용하며 기존 localStorage 데이터 삭제 없이 업그레이드를 유도.
- 혼동을 줄이기 위해 타이틀에 `라니팡 v0.7` 고정 버전 텍스트 표시. '라니팡 v0.7' 표시가 없으면 v0.7을 보고 있는 것이 아님.

## 남은 작업
- 스테이지 진입 준비 패널(목표/부스터/사전구매), 지역별 월드 지도 아트, 60fps 보석 스프라이트 및 음향, 캐릭터 고유 자산 확대.
- 실제 Android Chrome/삼성인터넷/카카오 인앱/iOS Safari/PWA installed 모드 뒤로가기·풀스크린 검증.
- 개인정보·유저 동의·상표검색(KIPRIS) 후 공개 런칭. 해당 조사로 상표 독점권 확보를 주장할 수 없음.
