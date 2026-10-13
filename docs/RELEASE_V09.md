# 라니팡 v0.9 — 그래픽·지도·시간 도전·실행 검증

## 사용자 지적에 따른 문제 및 대응
- **지도 작동이 불명확:** v0.8은 10지역 탭과 지역별 5×5 버튼 25개였으며, 지도형 연결 경로가 없었다. v0.9에서는 3열 지그재그 25개 스테이지 노드와 24개 시각 연결 경로를 실제 DOM/SVG 좌표에 맞춰 렌더링한다. 10지역 탭은 전환되고 잠긴 단계는 비활성, 열린 단계는 준비창으로 진입한다. 일부 다른 지역은 아직 잠겨 있으며 이는 정상 진행 규칙이다.
- **첫 화면 그림이 안 보임:** v0.8 CSS 배경에만 의존하던 상태를 `img#lany-cover-image` 직접 로딩으로 변경하고 `load`/`error` 확인과 기본 배경 대체 처리를 추가. 원본 이미지 파일은 그대로 유지하며 query-version `?v=0.9.0`로 캐시 갱신을 유도.
- **시간 흐름/긴박감 부족:** 단계 준비 화면에서 기본 `시간 도전 ON`(1지역 185초, 지역마다 7초씩 감소, 최저 115초) / `기본 모드 OFF`를 선택할 수 있다. 제한 시간이 끝나면 실패하며 제한을 끄면 실제 경과 시간만 표시된다. 플레이 진행 중에만 카운트되며 월드맵/도움말/뒤로가기 일시정지/앱 숨김에서 멈추고 복귀 시 재개. 30초 경고/10초 시각 효과/초읽기 효과음(활성화 시).
- **블록 그래픽:** 7종 이모지 블록에 빛반사/색상별 광택/테두리/그림자 고도화. 기존 CSS `nth-child`가 보석의 위치에 따라 색을 지정하던 문제를 보석 종류(`gem-0..6`) 기준으로 교정.
- **오래 이어지는 3색 랜덤 자동연쇄:** 한 이동에서 8회 연쇄 이후 자동 재섞기해 비정상적으로 장시간 무한 연쇄가 지속되는 현상을 차단. 나머지 목표 점수 보정은 v0.8 그대로이며 전문 밸런스 검증은 후속 과제.

## 검사
- `node tools/check-release.cjs`
- `node tools/check-korean-ui.cjs`
- `node tools/check-korean-complete.cjs`
- `node tools/check-lany-shell.cjs`
- `node tools/check-world-map.cjs`
- `node tools/check-v09.cjs`
- `node tools/check-tempo.cjs` (가상 시계로 카운트/정지/기본 모드/제한 시간 실패 확인)
- `node tools/check-firebase-preview.cjs` (오직 Firebase preview 채널)
- `python tests/verify-v09.py` (Playwright Chromium 데스크톱 1366×768 + 모바일 390×844; 브라우저 직접 웹 탐색은 내부 보안 규칙에 차단되므로 `page.set_content()`에 실제 상대 경로를 넣고 라우트에서 로컬 자산을 동일 URL로 제공해 CSS/이미지/JS 로딩/조작 검사. **공개 URL의 실제 단말기 테스트는 별도.**)

## 사용자 데이터/배포 안전
- 브라우저 저장키 `sc_unlocked`, `sc_stars`, `sc_best`, `cv_last_level`는 변경하지 않는다.
- 신규 선택 키 `lany_timed_challenge`는 `on/off`뿐이며 사용자 기존 기록 삭제 없음.
- 라이브 Firebase 배포 금지. 프로젝트 `cardville`, `cardville-match3-preview` 임시 채널에서만 시험.
- 프레임별 입자, 본격 사운드팩/지역별 완전히 다른 신규 일러스트/보스 10종 고유 패턴/Firestore Cloud Save는 이번 버전에 포함하지 않음.
