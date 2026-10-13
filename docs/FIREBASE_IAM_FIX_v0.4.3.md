# CardVille Firebase Preview — Confirmed IAM blocker (2026-10-14)

## Evidence from actual runs
- [Run 38417296378](https://github.com/junl-im/CardVille/actions/runs/38417296378): project check failed because `require("./.firebaserc")` wrongly treated extensionless JSON as JS. Fixed in [commit 1f745a8](https://github.com/junl-im/CardVille/commit/1f745a8ba5bd2bc213b3a946f8da8e64205741d1).
- [Run 38419409796](https://github.com/junl-im/CardVille/actions/runs/38419409796): level checks, project checks, and service-account JSON shape verification **all passed**. Deployment then failed during Firebase API access with HTTP **403** `USER_PROJECT_DENIED`.
- Exact Google response: `Caller does not have required permission to use project cardville. Grant the caller the roles/serviceusage.serviceUsageConsumer role ... serviceusage.services.use`.
- Follow-up Firebase Projects API: HTTP 403 `The caller does not have permission`. The preview was **not** deployed; live was untouched.

## IAM fix — requires a project administrator
1. Open [Google Cloud IAM for project cardville](https://console.cloud.google.com/iam-admin/iam?project=cardville), ensure the selected project is truly **cardville**.
2. Identify the **service account used by the GitHub secret `FIREBASE_SERVICE_ACCOUNT_CARDVILLE`**. Look up its `client_email` from the original JSON on your own device; never paste that JSON or private key into chat, code, Notion, Drive or an issue.
3. Find that service account principal in IAM; if absent, choose **Grant access** and enter its `client_email`. Edit/grant its project roles.
4. Add **Service Usage Consumer** (`roles/serviceusage.serviceUsageConsumer`) for this project. This fixes the *specific* missing `serviceusage.services.use` reported by Google.
5. Ensure **Firebase Hosting Admin** (`roles/firebasehosting.admin`) is granted for Hosting deployments. The action's [service account guidance](https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md) also recommends Firebase Authentication Admin (`roles/firebaseauth.admin`) for preview URL authorized domains and API Keys Viewer (`roles/serviceusage.apiKeysViewer`) for CLI API key inspection; add only where the deployment needs them. Cloud Run Viewer is needed when Hosting rewrites to Cloud Run/Functions are configured.
6. Save the IAM changes and allow permission propagation. Then in [CardVille Firebase preview workflow](https://github.com/junl-im/CardVille/actions/workflows/firebase-hosting.yml) select **Run workflow** on `main`. Do not click the Pages workflow instead.
7. If still 403, check the principal matches the actual JSON secret and that the account has project-level access to **cardville**. A valid JSON Secret can belong to a different project.
8. Review new run's preview URL in its summary; verify the game. Leave `live` channel untouched until preview is verified.

## Current status and safety
- Code and CI syntax issue: FIXED.
- GitHub Secret presence and JSON shape: checked in workflow, PASS.
- Google Cloud IAM role grant: **NOT completed** from this environment (no IAM write tool).
- Firebase preview Hosting: **NOT deployed**, reason 403 role missing.
- Firestore/Auth/Storage and live Hosting: unchanged.
- **No need to recreate or paste secret merely for the current 403.** Update service account IAM first.
