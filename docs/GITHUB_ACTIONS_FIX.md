# GitHub Actions build error fix

## Problem

GitHub Actions failed with this message:

```txt
Error: Dependencies lock file is not found
Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock
```

## Cause

The previous workflow used:

```yml
cache: npm
```

and:

```bash
npm ci
```

`npm ci` and the npm cache option expect a committed lock file such as `package-lock.json`.
The first starter package did not include `package-lock.json`, so the workflow stopped before build.

## Fix used in v0.1.1

The workflow now installs dependencies with:

```bash
npm install --no-audit --no-fund
```

and does not use the npm cache option. This allows GitHub Actions to build the project even when `package-lock.json` is not present.

## Recommended later

After the project is running locally, run:

```bash
npm install
```

Then commit the generated `package-lock.json` to GitHub. After that, the workflow can be switched back to `npm ci` for stricter reproducible builds.
