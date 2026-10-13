# v0.4.2 Firebase preview deployment trigger — 2026-10-13

The user confirmed that GitHub Actions Secret `FIREBASE_SERVICE_ACCOUNT_CARDVILLE` is registered.

- **Firebase project ID:** `cardville` (user confirmed).
- **Deployment mode:** temporary preview channel `cardville-match3-preview`, expires after 14 days.
- **GitHub workflow:** `.github/workflows/firebase-hosting.yml`.
- **Trigger:** a push to `main` changing `ops/firebase-preview-trigger.json`, OR manual `workflow_dispatch`.
- **Existing live Hosting site:** must not be overwritten. No `channelId: live`, no Firebase database, Auth, Firestore or Storage changes.
- **Preflight:** `node tools/check-release.cjs` and `node tools/check-firebase-preview.cjs`.
- **Post-deployment verification:** reports preview URL and expiry in GitHub Actions run summary, checks HTTP response for `CardVille` and `const LEVELS`.
- **If deployment fails:** view Actions logs for invalid service account, missing Hosting role, disabled Hosting site, wrong project ID or GitHub Actions permission settings. Do not paste the JSON secret into a chat or project document.
- **Status:** trigger source committed by assistant; real GitHub Actions deployment result requires observing workflow run and Firebase preview endpoint. Do not claim success until verified.
