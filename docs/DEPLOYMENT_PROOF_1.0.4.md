# Deployment Proof Guide 1.0.4

GitHub Actions success alone does not always mean the visible GitHub Pages site changed. This patch adds proof files to the Pages artifact.

## Required check

After deployment, open:

```txt
https://junl-im.github.io/CardVille/deploy-proof.html
```

Expected:

```txt
CardVille Deploy Proof
version: 1.0.4
```

## Result interpretation

### deploy-proof.html is 404

The Pages artifact is not being served, or the wrong Pages source is active.

### deploy-proof.html shows older version

GitHub Pages is serving an older deployment.

### deploy-proof.html is 1.0.4 but the game page does not start

Then the issue is runtime JS or browser compatibility. Check browser console and the fallback message.

### /CardVille/ shows source fallback with `/src/main.ts`

The repository source is being served directly instead of the built artifact. Use GitHub Actions as the Pages source.
