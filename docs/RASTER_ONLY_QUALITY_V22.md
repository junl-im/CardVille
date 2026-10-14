# 라니팡 v2.2 — SVG 완전 퇴출 및 시각 품질 정비

## 기준본 확인 (2026-10-14)
- Notion MASTER: https://app.notion.com/p/3f8fff243ec981c69f37cd5245069c34
- Notion ASSET MASTER: https://app.notion.com/p/3f9fff243ec981449570ee327703ecc6
- Notion v2.1 실제 이미지 패치: https://app.notion.com/p/3f9fff243ec9813db826eafe90cd57b5
- Google Drive v2.1: https://docs.google.com/document/d/1vgAKgnWZda8yE44UHSCrrvoYuijGHJ7YYG0S0_QDZNg
- Google Drive 원본 PNG 20종: https://drive.google.com/drive/folders/1KUcjKBqxzpLqt4ofEbiQWJ1OYbVr4Onv
- 코드 기준: https://github.com/junl-im/CardVille

## 확인된 품질 문제와 해결
1. Legacy .svg 파일 29개가 repo에 남고 지도 동선/액션 단추와 PWA에 참조되어 있었음. 전부 삭제.
2. 지도 경로선은 DOM 벡터로 매번 생성되었음. 방향과 길이를 계산한 CSS 점선 div/i 요소로 대체.
3. 화면에 여러 차례 추가한 CSS가 동시에 켜져 있고 정보 배치가 분산되어 있었음. 최후 순서의 `web/css/lany-ui-v22.css`로 HUD, 지도, 이동 게이지, 부스터 정리. 게임명 HUD 비표시.
4. HUD의 남은 이동 값이 하단 작은 글자에만 있었음. 상단 전용 WebP 판넬+대형 숫자로 이동. 기존 한글 레이블과 JS 상태 유지.
5. 진행률이 얇은 단색 바였음. 개별 WebP 진행 트랙, 광택 황금 게이지, 별 3개 진행도 표시. 기존 점수 목표와 달성 논리 변경 없음.
6. PWA 아이콘 생성이 벡터 소스/벡터 도구를 사용했음. repo의 원본 512 PNG만 Pillow로 크기 변환하며 Android 마스크형 안전영역 포함. 브라우저 PNG favicon, Apple Touch 지원.
7. 앞으로 svg 파일, 벡터 API, HTML/CSS/JS의 관련 참조를 금지하는 `tools/check-raster-only-v22.cjs` 자동 검사 적용.

## 원본 보존 / 게임 안정성
- v2.1 그래픽 시트 소스 ZIP과 Drive 원본 PNG 20종은 수정·삭제하지 않음.
- 단지 라니팡 repo에서 legacy SVG 29개만 삭제.
- 기존 WebP 동물 얼굴, 지도 메달 4종, UI 버튼 51종을 재사용. 게이지 WebP 2개 신규 생성, 전체 53종.
- 250개 레벨, 게임 규칙, 점수, 별, 아이템, 사용자 로컬 저장 키는 변경하지 않음.
- PC 우클릭/드래그 방지, 모바일 터치 이동, 맵/준비/게임 구조 유지.

## 테스트·승인 기준
- Node 정적 회귀: 모든 레거시 검사 + SVG 재유입 금지.
- Chromium 실제 렌더: 320×440, 320×568, 390×844, 1366×768 지도·퍼즐판·HUD 및 에셋 응답.
- PWA: PNG 이미지 크기 검증과 인터넷 없이 재실행.
- 이번 자동 QA의 사진은 GitHub Actions Artifact에 올림. 물리 단말 성능/미적 만족도는 추가 사용자 검수 필요.
- 본 문서 자체로 배포 성공을 의미하지 않음. CI와 Hosting 배포 결과는 실제 작업 완료 이후 기록.

## 시각 설계 정책
- SVG 자산 재사용 금지. 사용자 승인 PNG/WebP 원본과 해당 소스에서 합법적으로 만든 개별 WebP/PNG만 사용.
- 게임 플레이의 텍스트/숫자는 DOM으로 동적 갱신하여 읽기 쉽고 접근 가능한 상태 유지.
- 배경 이미지 위에 다시 기하학적인 옛 UI를 중복하여 그리지 않음.
