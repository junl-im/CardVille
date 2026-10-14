# 라니팡 v2.0 — PWA 캐시 안정화와 일관된 WebP 지도

## 실제 문제
- 이전 `web/sw.js`는 사이트의 거의 모든 성공적인 GET 응답을 그대로 `cache.put(event.request, response)` 했습니다.
- 업데이트 검사 `version.json?_fresh=<현재시각>`, 앱 갱신용 `?_refresh=<현재시각>`은 요청할 때마다 고유 URL입니다. 이 응답들을 계속 캐시하면 불필요한 CacheStorage 항목이 누적될 수 있습니다.
- 실제 휴대폰에서의 장시간 렉은 한 가지 원인으로 단정할 수 없지만, 이런 무제한 캐시 확대는 제거하는 것이 안전합니다.

## 수정
1. Service Worker 정적 allowlist: 최초 설치 시 게임 실행 및 검증된 WebP만 오프라인 캐시. **버전 JSON, 캐시 방지 쿼리, 동적 GET, 새로고침 URL은 캐시하지 않음.**
2. 캐시된 정적 파일을 조회할 때 쿼리를 제거한 **정규화된 경로 1개**를 사용. `image.webp?v=1`, `image.webp?v=2` 모두 하나의 캐시 키.
3. 앱 화면 이동은 network-first, 네트워크가 없으면 이미 캐시된 단일 `index.html`로 복귀. 이전 이름의 Service Worker 캐시 정리. 기존 진행 데이터(localStorage, Firestore/Auth) 변경 없음.
4. 전용 WebP 얼굴 30종 + 표정 WebP 자산을 2MB 미만 수준의 보조 오프라인 에셋으로 추가.
5. **지도 원본 `world-map.webp` 유지**, 지역마다 색감 10종 추가. 현재/일반/보스/잠금 스테이지 표식을 256px WebP 4종으로 변경. 프로젝트의 기존 토끼/곰 화풍과 결합. 신규 SVG 마스코트 생성 없음.
6. 모바일 블록 한 칸마다 반복되는 drop-shadow filter 제거하여 GPU 합성 부담 감소. 게임 시계는 제목/지도/일시정지/백그라운드에서 timer 0개, 실제 진행할 때만 타이머 1개.
7. PWA 버전 2.0.0-beta, `web/version.json`/manifest/SW 동일한 버전.

## 테스트
- `tools/check-v20-cache-map.cjs`: 캐시 allowlist·쿼리 중복 방지·웹p 4종·오프라인 동물 30종·시간 시계 정리.
- `tools/check-tempo.cjs`: 시작/일시정지/이어하기/종료 시 타이머가 정확히 0개/1개인지 가상 시간 검사.
- `tests/verify-v20-offline-map.py`: Playwright 320×568/390×844/1366×768에서 **버전 검사 60회+동물 이미지 쿼리 변형 20회 이후 캐시 키 수 불변** 확인. 비행기모드 재진입→64개 퍼즐 셀 정상 확인.
- 이전 40번 재시작 QA와 실제 매칭 9라운드 QA, 전체 PWA 및 지도 기능 회귀 유지.
- GitHub Pages, Firebase preview/LIVE는 생성 이미지 확인·정적 회귀를 모두 통과해야 배포.

## 남은 점검
기존 배포에서 쌓인 이전 버전 캐시는 새 서비스워커가 설치·활성화되면 이전 `lanypang-match-` 캐시가 정리됩니다. **PWA 캐시 정리와 별도로, 실제 휴대폰에서의 10~20분 FPS·발열 확인은 아직 필요합니다.** `?perf=1` 진단 모드는 계속 사용할 수 있습니다.
