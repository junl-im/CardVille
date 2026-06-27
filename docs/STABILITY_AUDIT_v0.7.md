# CardVille v0.7 Stability Audit

## 검사 항목

- TypeScript 빌드
- 상대 import 누락
- JSON 데이터 무결성
- GitHub Pages base 경로
- Firebase Auth / Firestore 연결 구조
- Firestore Rules 필드 허용 범위
- UI 세로 화면 배치
- PWA 기본 파일 존재 여부

## 이번에 확인한 문제와 조치

### 1. import 누락 반복 문제

이전 버전에서 `CollectionTypes`, `CollectionSystem` 누락으로 GitHub Actions 빌드가 실패했습니다.

조치:

- `tools/check-relative-imports.mjs` 유지
- GitHub Actions에서 `npm run verify` 실행
- 통파일 ZIP과 패치 ZIP 모두 systems / types 의존 파일 포함

### 2. JSON 데이터 오류 가능성

모드가 늘어나면 answerKey 짝이 맞지 않거나, catalog는 open인데 JSON이 없는 문제가 생길 수 있습니다.

조치:

- `tools/check-json-data.mjs` 추가
- open 모드 JSON 존재 검사
- 각 stage 카드 수 검사
- answerKey별 정확히 2장 검사
- pack set 참조 검사

### 3. UI 겹침

v0.6까지는 로비 버튼과 하단 문구가 빡빡했습니다.

조치:

- 로비 버튼 간격 재정리
- PlayScene HUD를 2단 구조로 변경
- StageSelect 진행률 바 위치 조정
- ModeSelect 책 간격 축소 및 텍스트 길이 제한

### 4. Firestore Rules

progress 문서가 v0.7에서 `maxUnlockedStage`, `totalStars`, `stages` 필드를 추가로 사용합니다.

조치:

- `firebase/firestore.rules`의 progress 허용 필드 확장

## 검증 명령

```bash
npm run check:imports
npm run check:json
npm run build
npm run verify
```
