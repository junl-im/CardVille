# Engine Upgrade v1.0-rc.1

## 신규 시스템

## ThemeSystem

- 선택 월드 관리
- 선택 카드 뒷면 관리
- preload 대상 월드/카드뒷면 에셋 제공
- localStorage 기반 즉시 저장

## 신규 씬

- WorldSelectScene
- CardBackSelectScene
- PackInfoScene
- CardDetailScene

## 검증 도구

- tools/check-ui-layout.mjs

UI 좌표가 캔버스 밖으로 나가는 기본 사고를 잡고, 신규 RC 씬 누락을 검사합니다.
