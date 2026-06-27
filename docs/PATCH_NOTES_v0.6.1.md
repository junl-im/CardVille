# CardVille v0.6.1 Hotfix

## Purpose

This release fixes the GitHub Actions TypeScript build error:

```txt
src/firebase/firestore.ts: Cannot find module ../game/types/CollectionTypes
```

## Cause

`src/firebase/firestore.ts` imports `OwnedCardRecord` from `src/game/types/CollectionTypes.ts`.
Some patch application paths did not carry the type file into the repository, so the full TypeScript compiler failed in GitHub Actions.

## Fixed

- Added `src/game/types/CollectionTypes.ts` explicitly to the patch package.
- Added `src/game/types/ModeTypes.ts` explicitly to the patch package for safe type dependency resolution.
- Updated package version to `0.6.1`.
- Verified production build using `npm run build`.

## Build Result

```txt
npm run build
✓ built
```
