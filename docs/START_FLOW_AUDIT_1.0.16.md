# CardVille 1.0.16 Start Flow Audit

## 이전 흐름

```txt
접속
→ HTML boot fallback: 카드마을을 여는 중
→ BootScene 전체 에셋 preload
→ IntroLoadingScene 자동 재생
→ LoginScene
```

이 흐름은 첫 화면에 부팅 화면이 먼저 보이고, 사용자가 아직 게임 시작을 누르지 않았는데 영상이 먼저 나오는 문제가 있었다.

## 새 흐름

```txt
접속
→ HTML fallback도 시작 화면 형태로 표시
→ BootScene 최소 에셋만 preload
→ LoginScene 표시
→ 게임 시작 클릭
→ IntroLoadingScene에서 영상 + 게임 리소스 로딩
→ MainLobbyScene
```

## 검증 포인트

- `index.html`에 `카드마을을 여는 중` 문구가 없어야 한다.
- `BootScene`은 `IntroLoadingScene`으로 자동 이동하지 않아야 한다.
- `LoginScene`이 표시된 뒤 fallback이 제거되어야 한다.
- `IntroLoadingScene`은 `게임 시작` 이후에만 호출되어야 한다.
- 인트로 영상 실패 시에도 메인 로비로 넘어가야 한다.
