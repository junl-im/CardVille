# UI Touch Audit 1.0.8

## 발견된 문제
이전 버전의 버튼은 컨테이너 자체에 hitArea를 직접 붙이는 방식이었습니다. 일부 모바일 브라우저에서는 시각적 버튼 위치와 실제 터치 판정이 미세하게 어긋날 수 있습니다.

## 조치
- `GameButton` 내부에 투명 `Zone`을 추가했습니다.
- 모든 버튼 터치는 해당 Zone에서 받고, 외부에는 `pointerup`, `click`, `onClick()`으로 전달합니다.
- hitbox는 시각 버튼보다 가로 +58px, 세로 +42px 크게 설정했습니다.
- `?touchDebug`를 URL에 붙이면 터치 영역을 분홍색 반투명 박스로 확인할 수 있습니다.

예시:
`https://junl-im.github.io/CardVille/?touchDebug`

## 남은 점검
실기기에서 버튼 위치가 여전히 어긋나면 Phaser Scale FIT + 브라우저 viewport 조합을 추가 보정해야 합니다.
