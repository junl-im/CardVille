# 라니팡 v1.8 — 실제 WebP 아트 복귀 · 검은 고양이 · 누적 렉 안정화

## 확인된 사실
- 프로젝트 원본 WebP 에셋 105개를 확인. 주요 실제 원본: `web/assets/lanypang-cover.webp`, `web/assets/friends/{rabbit,bear,chick,cat}.webp`, `web/assets/polish/{rabbit,bear,chick,cat}-*.webp`.
- v1.7의 SVG title-forest/title-mascots/title-*.svg가 이 원본 위에서 우선 표시되어 원래 화풍과 다른 프리젠테이션을 만들었음. 원본 삭제는 없었음.
- 기존 `renderBoard()`가 매번 **64개 셀, 64개 DOM 클릭 리스너, 64개 img 노드**를 만들고 기존 노드를 버리는 구조임. 플레이 도중 반복 생성으로 GC·레이아웃 비용이 커질 수 있음.
- `resolveMatches` 등의 비동기 cascade는 새 판을 시작해도 기존 `await sleep()` 다음에 이전 단계의 보드를 변경할 가능성 있음.

## 수정
1. 타이틀은 기존 고품질 `lanypang-cover.webp`를 다시 노출. v1.7 대체 SVG 캐릭터/배경 비표시.
2. `tools/build-visual-v18.py`: 기존 캐릭터 WebP에서 **투명 WebP 전용 버튼 4종, 라니팡 로고, 검은 고양이**를 재생성. GitHub Actions의 Pages, Firebase preview/LIVE 배포마다 동일 소스에서 빌드.
3. 고양이는 기존 cat WebP 얼굴의 형태·투명도·일부 질감을 보존하며 짙은 남색/검정으로 변경하고 민트색 눈과 핑크 귀 포인트. `friends/cat.webp` 및 `polish/cat-*.webp` 모두 배포 웹 디렉터리에 생성해 도감/게임 타일/표정 효과를 통일. 나머지 29종 및 원본 파일 보존.
4. 8×8 보드: `renderBoard`가 한 번만 DOM/리스너를 만들고, 이후 기존 셀 및 이미지 URL·클래스만 갱신. 단계 40회 반복에도 `LanyPerf.cellCreates===64`.
5. `state.playEpoch`로 기존 단계 비동기 교환·콤보·중력 및 힌트의 **다음 판 이후 작업 금지**. 승리/실패 시 힌트 타이머 정리.
6. 타이틀이 아닐 때 불필요한 장식용 캔버스 파티클 렌더 중지. 기존 프레임 속도 제한 유지.
7. 1.8.0-beta/PWA 오프라인 캐시 및 업데이트 검사 동일 버전으로 정렬. 구형 SVG 장식은 PWA 프리캐시에서 제거.

## 품질 게이트
- `tools/check-visual-perf-v18.cjs`: 1.8 HTML→WebP 경로, 생성 스크립트, SW 및 퍼즐 DOM 재사용/async token 검증.
- 빌드 이후 `--raster`: 5종 WebP 로고/버튼 실제 이미지 출력, 블랙 캣/캐릭터 파일 검증.
- `tests/verify-v18-perf.py`: Playwright Chromium의 **모바일 320×568, 390×844, 데스크톱 1366×768**에서 40회 연속 재시작 후 DOM 64개/신규 클릭 리스너 0건/비동기 이전판 상태 변경 없음. 원본 배경/래스터 아트 로드 검사.
- 기존 250단계·지도·PWA·버튼·도감 리그레션 동시 수행.
- 정확한 메모리 누수 원인은 장기 실제 기기 프로파일링 전까지 확정할 수 없음. 이번에는 확인 가능한 반복 DOM 재생성/이전 단계 비동기 수정의 두 비용을 실제로 제거함.

## 배포
PR 테스트 통과 후 미리보기 채널 자동 동기화 확인 → 정식 LIVE 릴리스 승인. 기존 Firestore/Auth, 서비스 계정 및 사용자의 게임 진도 데이터는 변경하지 않음.

## 비주얼 목표
참고 시안은 동물·버튼·로고가 하나의 통일된 상용 퍼즐 일러스트 스타일. 본 v1.8은 원본 WebP 복구와 새로운 WebP 로고/버튼 파이프라인의 **기반 단계**이며, 새로운 3D 콘셉트 이미지의 픽셀 단위 재현까지 완료됐다는 의미는 아님.
