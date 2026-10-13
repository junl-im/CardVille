# CardVille Firebase integration (deployment configured, not connected)

Existing Firebase project required. Project display name **does not prove** Firebase project ID.

GitHub repository Settings -> Secrets and variables -> Actions:
- Variable: `FIREBASE_PROJECT_ID_CARDVILLE`: **exact Project ID** from Firebase console Project Settings (not display name).
- Secret: `FIREBASE_SERVICE_ACCOUNT_CARDVILLE`: JSON service-account key authorized to deploy Firebase Hosting (protect; never commit).

Then Actions -> CardVille Firebase Hosting (manual) -> Run workflow.

`firebase.json` points to `web/`. This does not configure Firestore, Analytics, Authentication or Cloud Functions, and it does not delete existing project resources. Firebase live deployment replaces the Hosting site version, so verify the project and intended Hosting site first. If multi-site, configure a target before deployment; current defaults to the default Hosting site.
