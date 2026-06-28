# CardVille 1.0.11 Patch Notes

## 목적

1.0.10에서 정상 실행되는 말 카드 스택 게임을 깨지 않으면서 UI/UX, 콘텐츠, 디자인, 기술 안정성을 넓혔다.

## 적용 내용

- 말 카드 스테이지 8개로 확장
- 스테이지 잠금/해금 구조 추가
- 스테이지 선택 페이지 기능 추가
- 카드마을 광장에 이어하기 버튼 추가
- 카드마을 광장에 진행도/보유 카드 요약 추가
- 플레이 화면 중앙 보드 배경 정리
- 카드 디자인을 더 2.5D 카드 느낌으로 보정
- 보너스 미터 추가
- 힌트/셔플 사용 시 콤보 및 보너스 초기화 규칙 명확화
- 보상 카드 희귀도 시스템 추가
- 보상 카드풀 확장
- 카드 앨범 페이지 구조 추가
- localStorage 진행도 v111로 마이그레이션
- SVG 파일 금지 검사 추가
- UI/콘텐츠 체크 스크립트 추가
- 모바일 브라우저 기본 제스처 방지 보강

## 검증

```txt
npm run verify
✓ built
Deploy source check passed.
Brand check passed.
UI/content check passed. Version 1.0.11, word stages 8, SVG files 0.
```
