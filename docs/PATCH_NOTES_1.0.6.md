# CardVille 1.0.6 Hotfix

## Purpose
Fix TypeScript build errors caused by stale 1.0.x systems referencing `AuthSystem.currentUser` and `AuthSystem.isLocalGuest()` after the 1.0.5 clean-stable simplification.

## Fixed
- Restored `AuthSystem.currentUser` compatibility property.
- Restored `AuthSystem.isLocalGuest()` compatibility method.
- Added compatibility methods: `createEmailAccount`, `signOut`, `isFirebaseUser`, `getDisplayName`, `getLoginLabel`.
- Kept the 1.0.5 clean boot flow: guest starts locally without Firebase.
- Google/email still load Firebase only when selected.

## Recommendation
If you applied earlier patch ZIPs over old project files, stale files such as `UserDataSystem.ts`, `ProgressSystem.ts`, and `CollectionSystem.ts` may remain. This hotfix lets those files compile, but the safest path is still to replace the repository with the full 1.0.6 package.
