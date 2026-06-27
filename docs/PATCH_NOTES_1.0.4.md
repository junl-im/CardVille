# CardVille 1.0.4 Patch Notes

## Purpose

1.0.4 is a deployment-proof and runtime boot stability patch. It is focused on the case where GitHub Actions passes but the public GitHub Pages site still shows the HTML fallback or a blank screen.

## Changes

- Removed early `window.__CARDVILLE_APP_STARTED__ = true` from `src/main.ts`.
- The HTML fallback is no longer hidden before Phaser actually boots.
- Added a delayed boot warning if the Phaser engine does not respond.
- Added scene-level boot confirmation from `SplashScene`.
- Added GitHub Actions deployment proof files.
- Added dist file existence checks inside the workflow.
- Added `deploy-proof.html`, `deploy-proof.txt`, and `version.json` to deployed output.
- Updated version to 1.0.4.

## Verification URLs after deployment

Open these after GitHub Actions completes:

- `https://junl-im.github.io/CardVille/`
- `https://junl-im.github.io/CardVille/health.html`
- `https://junl-im.github.io/CardVille/reset.html`
- `https://junl-im.github.io/CardVille/build.json`
- `https://junl-im.github.io/CardVille/version.json`
- `https://junl-im.github.io/CardVille/deploy-proof.html`

If `deploy-proof.html` is not 1.0.4, the latest GitHub Actions artifact is not what GitHub Pages is serving.

## Most likely live-site diagnosis

If Actions passes but the page still shows an older version, the issue is outside the TypeScript build. Check:

1. Repository Settings > Pages > Source must be GitHub Actions.
2. The successful workflow must include the `deploy` job, not only the `build` job.
3. The deployed URL printed by the `Deploy to GitHub Pages` step must be the same URL you are opening.
4. If `health.html` or `deploy-proof.html` returns 404, the Pages artifact being served does not contain the expected dist files.
