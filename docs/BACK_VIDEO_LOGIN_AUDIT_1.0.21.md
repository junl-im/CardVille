# CardVille 1.0.21 Back / Video / Login Audit

## 뒤로가기

기존 문제는 브라우저/웹뷰에 따라 `popstate`가 제대로 잡히지 않거나, Phaser Scene overlay가 DOM canvas 위에서 보이지 않을 수 있다는 점이었다.

1.0.21에서는 DOM overlay를 최우선으로 만들고, Phaser `BackConfirmScene`은 보조 fallback으로 유지했다.

적용한 방어선:

- 설치 시 히스토리 가드 2단계 추가
- 최초 `pointerdown` / `touchstart` 이후 재무장
- `pageshow` / `focus` 때 재무장
- `popstate` / `hashchange` 모두 처리
- overlay가 열린 상태에서 뒤로가기를 한 번 더 누르면 나가기 시도

## 오프닝 영상

모바일 브라우저는 autoplay가 막히면 video 태그 위에 기본 플레이 아이콘을 보여줄 수 있다.

1.0.21에서는 video를 `playing` 전까지 숨기고, autoplay 실패 시 video DOM을 즉시 제거한다.

적용 내용:

- `data-cardville-hidden-until-playing`
- `opacity: 0` 상태로 mount
- `playing` 이벤트 후 fade in
- `play()` 실패 시 DOM 제거
- controls/PIP/remote playback 비활성화

## 로그인 화면

HTML fallback이 실제 버튼을 갖지 않도록 금지하고, Phaser LoginScene 버튼만 표시되도록 정리했다.

버튼 그룹은 한 패널 안에 더 촘촘하게 배치하여 공백 라인처럼 보이는 느낌을 줄였다.
