# CardVille v0.6.2 Hotfix

## 목적

v0.6.1 패치 ZIP에 `src/game/systems/CollectionSystem.ts`가 포함되지 않아 GitHub Actions에서 `TS2307` 오류가 발생한 문제를 해결합니다.

## 원인

`RewardScene.ts`와 `CollectionScene.ts`는 `../systems/CollectionSystem`을 import합니다. 그러나 일부 패치 ZIP에는 해당 파일이 누락되어 있었습니다.

## 수정 내용

- `src/game/systems/CollectionSystem.ts`를 패치 ZIP에 명시 포함
- `src/game/types/CollectionTypes.ts` 포함 확인
- `src/game/types/ModeTypes.ts` 포함 확인
- `tools/check-relative-imports.mjs` 추가
- `npm run check:imports` 스크립트 추가
- 빌드 전 상대 경로 import 누락 검사 가능

## 검증 명령

```bash
npm run check:imports
npm run build
```

## 결과

- 상대 경로 import 검사 통과
- TypeScript 빌드 통과
- Vite 프로덕션 빌드 통과
