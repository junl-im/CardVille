# CardVille v0.7.0 Patch Notes

## 핵심 목표

v0.7.0은 CardVille을 단순 데모에서 `성장 + 진행도 + 미션 + PWA`가 있는 실제 서비스 구조로 확장하는 대규모 업데이트입니다.

## 적용 내용

- 스테이지 잠금 / 해금 시스템
- 별 1~3개 클리어 등급
- 모드별 진행률 계산
- 꿈의 서고 책별 진행도 표시
- 낱말 / 연산 / 기억력 / 영어 4개 모드 오픈
- 총 12개 스테이지 JSON 데이터 추가
- 일일 미션 시스템
- 출석 보상 시스템
- 설정 화면
- 사운드 / 진동 / 절전 / 데이터 절약 옵션
- PWA manifest.webmanifest 추가
- service worker 기본 캐시 추가
- PNG 앱 아이콘 192 / 512 추가
- 컬렉션 기본 카드 24종 확장
- 카드팩 4종 정리
- Firestore progress Rules 확장
- JSON 데이터 검증 스크립트 추가
- GitHub Actions에서 verify 실행

## 안정성 개선

- `tools/check-relative-imports.mjs`로 상대 import 누락 검사
- `tools/check-json-data.mjs`로 오픈 모드 JSON 유효성 검사
- GitHub Actions 빌드 단계에서 `npm run verify` 실행
- mode catalog에서 open인 모드는 실제 JSON이 없으면 검증 실패
- stage의 answerKey는 정확히 2개씩 있어야 검증 통과
- pack이 존재하지 않는 collection set을 참조하면 검증 실패

## UI 개선

- StageSelect 카드에 잠김 / 클리어 / 별 등급 표시
- ModeSelect 꿈의 서고 책에 진행률 표시
- PlayScene HUD 겹침 완화
- ResultScene 별 등급 연출 추가
- MainLobby 버튼 배치 재정리
- Mission / Settings 신규 화면 추가

## 주의

- 실제 WebP 카드 이미지는 아직 포함하지 않았습니다.
- 현재는 이모지 기반 프로토타입 아트이며, imageKey 구조는 실제 WebP 연결을 위한 기준입니다.
- PWA 아이콘은 임시 PNG 아이콘입니다.
