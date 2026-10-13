# CardVille v0.4.3 Firebase workflow failure analysis

Failed run: https://github.com/junl-im/CardVille/actions/runs/38417296378
Job: 115365018712

Confirmed: `tools/check-release.cjs` and `tools/check-firebase-preview.cjs` passed. The next command `node -e 'const r=require("./.firebaserc")...'` failed with `SyntaxError: Unexpected token ':'` at JSON line 2. Deployment action and secret check were skipped. This is a workflow bug, not evidence of invalid Firebase credentials.

Fix: remove redundant require on extensionless JSON, retain `JSON.parse(fs.readFileSync(...))` from preflight tests. Validate secret JSON shape without logging it. Retry preview channel only (`cardville-match3-preview`). Existing live unchanged.

Firebase service account authorization and site existence remain unverified until new job reaches deployment.
