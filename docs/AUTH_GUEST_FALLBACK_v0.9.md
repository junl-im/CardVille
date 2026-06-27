# CardVille v0.9 Guest Login Fallback

## 문제

이전 버전에서는 `게스트로 바로 시작`을 눌렀을 때 Firebase Anonymous Auth 또는 Firestore 프로필 생성 중 하나라도 실패하면 로그인 전체가 실패한 것처럼 보였다.

## 수정

v0.9부터는 다음 순서로 동작한다.

1. Firebase Anonymous Auth 시도
2. 성공하면 Firebase 게스트로 입장
3. 프로필 Firestore 저장 실패 시에도 로컬 캐시로 계속 진행
4. Anonymous Auth 자체가 실패하거나 타임아웃되면 로컬 게스트로 입장
5. 로컬 게스트 UID는 localStorage에 저장되어 재접속 시 복구

## Firebase Console 체크

- Authentication > Sign-in method > Anonymous 활성화
- Authentication > Settings > Authorized domains > junl-im.github.io 추가
- Firestore Rules 최신화

## 주의

로컬 게스트 데이터는 해당 브라우저/기기에 저장된다. 기기를 바꾸거나 브라우저 데이터를 삭제하면 사라질 수 있다. 장기 보존이 필요하면 이메일 또는 Google 계정 연결을 유도해야 한다.
