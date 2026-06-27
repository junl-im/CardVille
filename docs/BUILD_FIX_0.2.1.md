# CardVille v0.2.1 Build Fix

## Fixed errors

### 1. TypeScript TS5107

Previous setting:

```json
"moduleResolution": "Node"
```

With TypeScript 6, this is treated as the old `node10` resolver and produces:

```txt
Option 'moduleResolution=node10' is deprecated and will stop functioning in TypeScript 7.0.
```

Fixed setting:

```json
"moduleResolution": "Bundler"
```

This is the correct resolver mode for a Vite browser project.

### 2. import.meta.env type error

Vite exposes `import.meta.env`, but TypeScript needs Vite client types.

Added:

```txt
src/vite-env.d.ts
```

With:

```ts
/// <reference types="vite/client" />
```

Also added this to `tsconfig.json`:

```json
"types": ["vite/client"]
```

### 3. Dependency stability

The previous package used `latest`, which can unexpectedly install TypeScript 6 or future major versions.

v0.2.1 pins versions:

```json
"firebase": "12.15.0",
"phaser": "3.90.0",
"typescript": "5.8.3",
"vite": "6.3.5"
```

### 4. GitHub Actions

`package-lock.json` is now included, so the workflow can safely use:

```bash
npm ci --no-audit --no-fund
```

## Verified locally

```bash
npm ci --no-audit --no-fund
npm run build
```

Result:

```txt
✓ built successfully
```
