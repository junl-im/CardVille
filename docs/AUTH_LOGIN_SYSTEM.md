# CardVille v0.5 로그인 시스템

## 목표

v0.5의 목표는 최초 1회 로그인 흐름을 실제 게임 루프에 연결하는 것이다.

지원 방식:

- 게스트 로그인: Firebase Anonymous Auth
- 이메일 로그인: Firebase Email/Password Auth
- 이메일 가입/연결: 게스트 상태에서 이메일 계정으로 업그레이드 가능
- Google 로그인: Firebase Google Provider
- 메인 로비 계정 상태 표시
- 로그아웃/계정 변경 버튼

## 중요한 설계

CardVille은 플레이 진입 장벽을 낮추기 위해 게스트 로그인을 가장 먼저 제공한다.
유저가 카드팩, 컬렉션, 진행도에 애착을 가지기 시작하면 이메일 또는 Google 계정으로 연결할 수 있다.

이 방식은 모바일 캐주얼 게임에 적합하다.

## 게스트 계정 업그레이드

`registerWithEmail()`은 현재 사용자가 익명 계정이면 새 계정을 따로 만들지 않고 `linkWithCredential()`로 연결을 시도한다.
Google도 현재 사용자가 익명 계정이면 `linkWithPopup()`을 먼저 시도한다.

이렇게 해야 게스트로 모은 카드 컬렉션과 진행도가 가능한 한 유지된다.

## Firestore Profile Fields

`users/{uid}` 문서에 다음 인증 관련 필드가 추가되었다.

- `displayName`
- `provider`
- `providerIds`
- `isAnonymous`
- `emailVerified`

Firestore Rules도 이 필드들을 허용하도록 업데이트되었다.

## Firebase Console 체크리스트

Firebase Console에서 다음을 확인해야 한다.

1. Authentication > Sign-in method > Anonymous 활성화
2. Authentication > Sign-in method > Email/Password 활성화
3. Authentication > Sign-in method > Google 활성화
4. Authentication > Settings > Authorized domains에 `junl-im.github.io` 추가
5. Firestore Rules를 `firebase/firestore.rules` 내용으로 배포

## 주의

GitHub Pages에서 Google 로그인 팝업이 실패하면 대부분 승인 도메인 누락이다.
`localhost` 개발 환경과 `junl-im.github.io` 배포 환경을 모두 승인 도메인에 넣어야 한다.
