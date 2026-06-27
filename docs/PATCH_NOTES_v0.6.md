# CardVille Patch Notes v0.6.0

## 핵심 패치

v0.6은 **유저 성장 데이터 실제 연동 패치**입니다.

## 적용 내용

```txt
✅ Firestore 유저 프로필 로딩 함수 추가
✅ UserDataSystem 추가
✅ 메인 로비 코인 / 보석 / 레벨 실제 데이터 표시
✅ XP 진행바 UI 추가
✅ 레벨 계산 함수 추가
✅ RewardScene 보상 저장 결과 표시
✅ 레벨업 토스트 연출 추가
✅ 오프라인 localStorage fallback 추가
✅ README v0.6 기준 정리
✅ USER_GROWTH_SYSTEM.md 추가
```

## 수정/추가 파일

```txt
package.json
README.md
src/firebase/firestore.ts
src/game/systems/UserDataSystem.ts
src/game/scenes/MainLobbyScene.ts
src/game/scenes/RewardScene.ts
docs/USER_GROWTH_SYSTEM.md
docs/PATCH_NOTES_v0.6.md
```

## 빌드 검증

```txt
npm run build
✓ built in 9.66s
```

## 주의사항

Firestore Rules는 v0.5.1 구조로도 v0.6의 기본 성장 데이터 저장을 허용합니다.  
Firebase Console에서 Authentication과 Authorized domains 설정은 계속 유지해야 합니다.
