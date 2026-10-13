# CardVille — Match-3 Puzzle (v0.3 beta)

PC/mobile web match-3, adapted from [Sweet Crush](https://github.com/ShaistaShabbir-prog/candy-crush-match3) under the MIT license. Upstream commit `0ba0fcd4af6c041669ba67dd7f7bb6d9d268e4ec`.

- `web/`: ready-to-host static website (includes original MIT LICENSE).
- `.github/workflows/pages.yml`: GitHub Pages deployment on `main`.
- `.github/workflows/firebase-hosting.yml`: **manual** deployment to the existing Firebase project, only after real project ID and service account are configured.
- `firebase.json`: Firebase Hosting public directory `web`.
- `docs/`: provenance, rollout and outstanding bugs.

**No Firebase credentials are committed.** Add repository variable `FIREBASE_PROJECT_ID_CARDVILLE` with the exact existing Firebase Project ID; add secret `FIREBASE_SERVICE_ACCOUNT_CARDVILLE` with authorized JSON credentials. Run workflow manually after configuration. Firebase database and user records are not touched.

**Known limitations:** level 100+ score targets need balancing; online leaderboard isn't secure or global; multiplayer mode needs remote room signaling; CC0 art packs not yet integrated; prior CardVille Git history remains reachable in repository commit history, although all prior files are removed from the new main tree.

Do not represent this as production ready. No assets have been copied from existing CardVille game; the old game was wholly replaced on current `main` file tree.
