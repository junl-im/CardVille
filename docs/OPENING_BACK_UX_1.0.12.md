# Opening & Back Button UX 1.0.13

## 첫 화면

업로드된 CardVille 키아트를 `public/assets/ui/cardville_login_bg.png`로 저장하고, `LoginScene`에서 390×844 기준 전체 배경으로 사용한다.

버튼은 키아트의 로고와 캐릭터를 가리지 않도록 하단 글래스 패널에 배치했다.

## 인트로 로딩

`public/assets/video/cardville_intro_loading.mp4`를 `IntroLoadingScene`에서 재생한다.

안전장치:

- 영상이 없어도 로그인 화면으로 진행
- 자동재생 실패 시 2.6초 후 진행
- 최대 3.6초 후 로그인 화면으로 진행
- 화면 터치 시 스킵 가능

## 휴대폰 뒤로가기

`BackButtonSystem`이 브라우저 history state를 하나 추가해 휴대폰 뒤로가기를 감지한다.

동작:

```txt
첫 번째 뒤로가기 → 확인 팝업
팝업 상태에서 뒤로가기 → 나가기 시도
첫 화면가기 → LoginScene으로 이동
나가기 → window.close() 시도 후 실패 시 history.back()
계속하기 → 팝업 닫기
```
