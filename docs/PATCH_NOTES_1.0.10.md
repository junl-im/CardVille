# CardVille 1.0.10 Patch Notes

## 목적
말 카드 스택 플레이가 단순 선택에서 실제 게임 루프처럼 느껴지도록 콤보, 점수, 힌트, 셔플, 보상, 진행도 저장을 추가했다.

## 변경 사항
- PlayScene에 점수, 콤보, 최고 콤보를 추가했다.
- 정답 시 카드 제거 애니메이션과 점수 플로팅 텍스트를 추가했다.
- 오답 시 흔들림, 감점, 콤보 초기화를 추가했다.
- 힌트 버튼이 실제로 정답 가능한 컬럼을 강조하도록 변경했다.
- 셔플 버튼이 남은 카드를 재배치하도록 변경했다.
- 목표 완료 시 scene.restart 없이 목표 카드만 갱신되도록 정리했다.
- ResultScene에 점수/콤보/별 결과를 표시한다.
- RewardScene 보상량이 별/콤보/점수에 따라 달라진다.
- StageSelectScene에 클리어 별과 최고 점수를 표시한다.
- SaveSystem에 스테이지 진행도 저장을 추가했다.

## 검증
- npm run build 통과
- npm run verify 통과
- check:deploy 통과
- check:brand 통과
