# CardVille 1.0.12 Patch Notes

## 목적

1.0.11에서 정상 동작하는 말 카드 스택 게임을 유지하면서, 첫 진입 연출과 휴대폰 뒤로가기 UX를 개선했다.

## 변경 사항

- 첫 로그인 화면 배경을 업로드된 CardVille 키아트로 변경
- 키아트에 맞춰 로그인 버튼을 하단 글래스 패널에 재배치
- 기존 인트로 MP4를 `IntroLoadingScene`에서 재생
- 영상 실패/자동재생 실패 시에도 로그인으로 넘어가도록 타임아웃 추가
- `BackButtonSystem` 추가
- `BackConfirmScene` 추가
- 휴대폰 뒤로가기 시 팝업 표시
- 팝업에서 `첫 화면가기`, `나가기`, `계속하기` 제공
- 뒤로가기를 두 번 누르면 나가기 시도
- 브라우저가 `window.close()`를 막으면 이전 페이지 이동으로 fallback
- SVG 사용 금지 유지

## 검증

```txt
npm run verify
```

검증 통과 항목:

- build
- check:deploy
- check:brand
- check:ui
