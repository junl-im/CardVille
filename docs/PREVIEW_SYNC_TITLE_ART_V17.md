# 라니팡 v1.7 — Firebase 미리보기 동기화 · 첫 화면 일러스트 보강

## 확인된 원인
- Firebase 미리보기 채널은 `cardville-match3-preview`로 LIVE와 다른 릴리스 채널.
- `.github/workflows/firebase-hosting.yml`은 기존에 `ops/firebase-preview-trigger.json` 변경 또는 수동 실행만 반응했고, 마지막 미리보기 요청 버전이 `1.0.1-lanypang-friends-mobile-popup-hotfix`.
- 정식 사이트 `cardville.web.app`와 GitHub Pages의 v1.6 배포가 성공해도 **미리보기 채널은 자동 갱신되지 않았음**.
- 모바일/PWA에서는 이전 Service Worker 및 HTML 브라우저 캐시가 구버전 화면 노출을 더 오래 지속시킬 수 있음.
- 따라서 "모바일에서 1.0.1" 현상은 브라우저 설정만이 아니라 **미리보기 채널 릴리스 관리 문제**를 포함한다.

## 실제 해결
1. `main`에 `web/**`, `tools/**`, `firebase.json`, 미리보기 워크플로 파일, 요청 JSON 변경 시 Firebase **별도 preview 채널을 자동 재배포**. LIVE는 이 워크플로에서 절대로 배포하지 않음.
2. 미리보기 업로드 후 서버 `version.json`과 저장소 `web/version.json`의 동일 여부를 HTTP 확인. 미리보기 요청 파일을 1.7.0-beta로 맞춤.
3. Firebase Hosting의 `/`, `/index.html`, `/version.json`, `/sw.js`는 `Cache-Control: no-cache, no-store, must-revalidate`로 지정.
4. 앱 안에서 `version.json`을 no-store로 확인해 실제 서버 버전이 현재보다 높으면 **업데이트** 버튼 노출. 사용자 요청 없이 강제 새로고침하거나 저장 데이터 삭제 금지.
5. 기존 250단계 및 `sc_unlocked`, `sc_stars`, `sc_best` 로컬 진행 키 유지. 오프라인 앱 캐시는 새 버전으로 정상 업데이트.

## 실제 디자인 개선
- 예시 이미지를 참고해 새 `title-forest-v17.svg`: 동화 숲, 하늘, 나무, 꽃, 하트 풍선, 사탕마을 집, 숲길을 한 장면으로 그린 원본 SVG.
- 새 `title-mascots-v17.svg`: 버튼 주변에서 웃는 토끼, 곰, 병아리 일러스트. 이벤트 방해 없이 버튼 뒤에 렌더.
- 큰 로고, 분명한 "게임 시작" 그림 버튼, 아래의 설치/게임 방법/도감 3열 그림 버튼. 예시처럼 **게임 캐릭터가 메인 버튼을 감싸는 구성**을 모바일/PC 각각 반응형으로 배치.
- 귀여운 행잉 우드 간판·다채로운 반짝임·젤리 버튼 반응 추가.
- 두 그림 모두 벡터로 제공하고 진입 화면의 기존 250단계 기능, PWA 설치, 텍스트 레이블, 움직임 감소 옵션과 충돌하지 않게 분리.

## 검증 계획
- `tools/check-title-stage-v17.cjs`: 미리보기 자동 갱신 경로·LIVE 배포 금지·서버 버전 검사·캐시 헤더·SVG 자산·PWA 갱신 UI.
- `tests/verify-title-stage-v17.py`: 320×568, 390×844, 1366×768, 320×440 Chromium에서 제목/캐릭터/이미지 로드, 버튼 한 줄 3개, 가로·세로 잘림 없음, 버전 갱신 배너 및 지도 열기.
- CI 통과 후 `main` 병합 → 자동 Firebase preview 업데이트 성공 확인 → 정식 LIVE 배포 승인 순서.

## 유의
- 예제의 이미지 화풍과 구도를 참고한 **새 SVG 캐릭터·배경**이며, 기존 예제 사진을 통째로 덮어 씌운 것은 아님.
- iOS Safari의 PWA 캐시 동작은 실제 기기별 수동 검사 필요.
- 기존 앱 바로가기를 직접 구버전 미리보기 채널로 만들었다면 미리보기 재배포 후 주소를 새로 열거나 브라우저 사이트 데이터/기존 PWA 제거가 필요할 수 있다. 그러나 진행 기록 삭제 위험 때문에 사이트 데이터 삭제는 먼저 권하지 않는다.
