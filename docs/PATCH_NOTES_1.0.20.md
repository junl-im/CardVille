# CardVille 1.0.20 Patch Notes

## 목적

1. 접속 직후 HTML fallback의 가짜 `게임 시작` 버튼이 잠깐 보이는 문제 제거
2. 첫 로그인 화면 버튼 간격을 더 촘촘하고 자연스럽게 정리
3. 휴대폰 뒤로가기 팝업을 Phaser Scene만이 아니라 DOM overlay로도 표시하도록 보강
4. 말 카드 연상 분류 오류 가능성을 줄이기 위해 `모양/도형` 카테고리 추가
5. 카드 앞면을 더 단단하고 눈 편한 불투명 카드 스타일로 개선
6. localStorage 저장값과 이메일 입력값 검증을 강화

## 주요 변경

- `index.html`의 `.boot-fake-button` 제거
- `LoginScene` 버튼 그룹 상향/압축 및 안내 문구 정리
- `BackButtonSystem` DOM 기반 확인 팝업 추가
- `SecuritySystem` 추가
- `SaveSystem` 저장 데이터 정규화/검증 강화
- `AuthSystem` 이메일/비밀번호 입력 검증 추가
- `wordStages`에 `shape` 카테고리 추가
- `정육면체` 스테이지를 강함이 아닌 모양/도형 연상으로 수정
- `check:association`, `check:security` 추가

## 검증

- `npm run verify` 통과
- build 통과
- deploy/brand/ui/layout/association/security check 통과
- SVG 0개 유지
- Service Worker/PWA 캐시 비활성 유지
