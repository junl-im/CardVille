# 라니팡 v2.2 실사용 래스터 에셋 패치

## 기준 원본과 무결성

2026-10-14에 새로 정리된 [노션 ASSET MASTER](https://app.notion.com/p/3f9fff243ec981449570ee327703ecc6)와 [Google Drive 원본 폴더](https://drive.google.com/drive/folders/1KUcjKBqxzpLqt4ofEbiQWJ1OYbVr4Onv)를 기준으로 작업했다. 아래 7개 PNG는 `art-source/v22/`에 원본 바이트 그대로 보관했다. `master-manifest.json`의 파일명·크기·SHA-256을 빌드 때마다 검사한다.

| 로컬 원본 | 디자인 역할 |
| --- | --- |
| `title-screen.png` | 첫 화면 화풍 기준 |
| `spring-ui.png` | 실제 플레이 화풍·검은 고양이 컷아웃 |
| `logo-variants.png` | 메인·대체·작은 로고 |
| `number-guide.png` | 스테이지·이동·점수 숫자 0~9와 쉼표 |
| `frame-sheet.png` | 나무·꽃 프레임, 빈 리본, 배지 |
| `star-result-sheet.png` | 빈 별 및 1·2·3별 결과 이미지 |
| `background-atlas.png` | 정원·맵·결과 배경과 반복 패턴 |

원본 PNG는 손대지 않는다. `tools/build-visual-v18.py`가 기존 v2.1 에셋을 생성한 뒤 `tools/build-ui-v22.py`, `tools/build-ui-v22-sheets.py`, `tools/build-ui-v22-individual.py`를 실행한다. 시트 처리기는 원본 7종의 해시를 확인한다. 시트 기반 WebP **85개**와 게임 화면용 **개별 제작 WebP 4개**, 총 **89개**가 `manifest.json`에 등록된다.

## 실제 화면 연결

- **첫 화면:** 로고 이미지 3종 중 메인 로고, 시작/설치/방법/도감 버튼, 설정·사운드·공지 아이콘, 정원 배경. 설치 버튼에는 봄정원 원본에서 분리한 **검은 고양이** 얼굴을 사용한다. 세 보조 버튼은 320px에서도 한 줄이다.
- **지도:** v2.2 정원 배경을 적용한다. 단계 표식과 주요 조작부는 검증된 v2.1/v2.0 WebP를 유지해 글자 가독성과 250단계 페이지 이동을 보존한다. 단계 연결선은 Canvas로 그린다.
- **준비/플레이:** 준비창 목표·이동 횟수와 게임 HUD의 스테이지·이동·점수·최고점수에 개별 숫자 이미지를 조합한다. 플레이 배경에는 새 꽃 정원 이미지를 쓴다. 기존 게임판 테두리는 유지한다. 상단 HUD 틀과 파랑·초록·분홍 버튼은 시트 크롭 대신 투명 배경으로 하나씩 생성한 원본 PNG에서 변환한다. 버튼의 한글 이름과 그림 아이콘은 실제 HTML·CSS로 분리해 이미지 확대에 따라 찌그러지지 않게 한다.
- **승리/실패:** 결과별 1·2·3 이미지 및 빈 별, 새 리본과 배경을 연결했다. 점수는 숫자 이미지로 보인다. 팝업 본체는 새 프레임 확대 시 게임판을 가리는 현상이 있어 검증된 v2.1 패널을 사용한다.

`web/js/lany-numbers-v22.js`는 숫자를 자릿수별 `<img>`로 생성한다. 화면 낭독·텍스트 검사에 필요한 문자열은 투명한 보조 텍스트와 `aria-label`로 유지한다. 값이 바뀌지 않으면 DOM을 다시 만들지 않는다.

## SVG 금지와 PWA

`web/`에서 SVG 파일 29개와 활성 참조를 제거했다. 버튼·파비콘·앱 아이콘·Service Worker 캐시는 WebP/PNG만 사용한다. 지도 경로는 SVG 대신 Canvas다. `tools/build-pwa-icons.py`도 기존 승인 512px PNG에서 파생 PNG를 생성하며 SVG 소스나 CairoSVG에 의존하지 않는다. v2.2 WebP 89개는 Service Worker 사전 캐시 목록에 포함한다.

개별 제작 원본은 `art-source/v22/individual/`의 `hud-frame.png`, `button-blue.png`, `button-green.png`, `button-pink.png`다. 내장 이미지 생성 도구로 기존 390px 게임 화면을 참조해, 크림·금색 테두리와 분홍·보라 그림자를 유지하면서 문자 없는 투명 PNG를 각 에셋별로 생성했다. 최종 제공 파일은 `web/assets/ui/v22/individual/`의 WebP다.

## 검증

- 원본 7개 SHA-256 확인 및 전체 생성 파이프라인 재실행 성공
- 정적 검사 21개, 래스터 검사 5개 통과
- 250단계 정의·저장 키·PWA 버전·오프라인 캐시 검사 통과
- Chromium 320×568, 390×844, 1366×768에서 첫 화면→지도→준비→게임→승리/실패 흐름 통과, 64칸 보드와 숫자/별 이미지 확인
- 오프라인 새로고침에서 타이틀과 로고 로드 확인; SVG 요청 0건; JavaScript 예외/404 0건

검토용 화면은 로컬 `docs/ui-v22/`에 저장한다. 실제 공개 사이트와 물리 휴대폰의 장시간 프레임 성능은 이번 로컬 검증에 포함되지 않는다. LIVE 배포 요청 파일 `ops/firebase-live-release.json`은 v2.1 그대로 두었으므로 v2.2의 LIVE 배포는 별도 릴리스 절차가 필요하다.
