# CardVille Patch Notes v0.5

## 적용 내용

- 로그인 화면 UI 재구성
- 게스트 로그인 버튼 유지
- Google 로그인 버튼 실제 연결
- 이메일 로그인 입력창 추가
- 이메일 가입/연결 버튼 추가
- 게스트 계정을 이메일/Google 계정으로 연결하는 로직 추가
- 메인 로비에 현재 로그인 상태 표시
- 로그아웃/계정 변경 버튼 추가
- Phaser DOM 입력 UI 사용을 위한 `dom.createContainer` 활성화
- Firestore 유저 프로필 필드 확장
- Firestore Rules 업데이트
- 로그인 시스템 문서 추가

## 변경 파일

- `src/game/scenes/LoginScene.ts`
- `src/game/scenes/MainLobbyScene.ts`
- `src/game/config/phaserConfig.ts`
- `src/game/systems/AuthSystem.ts`
- `src/firebase/auth.ts`
- `src/firebase/firestore.ts`
- `src/styles/index.css`
- `firebase/firestore.rules`
- `docs/AUTH_LOGIN_SYSTEM.md`
- `docs/PATCH_NOTES_v0.5.md`
- `package.json`
- `package-lock.json`

## 다음 예정

v0.6에서는 실제 저장 데이터를 기반으로 메인 로비의 코인, 보석, 레벨, 경험치 표시를 연결한다.
