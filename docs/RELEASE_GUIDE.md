# Release Guide

Step-by-step guide for releasing new versions of `@paya-labs/admin-ui` and `@paya-labs/create-admin-ui`.

Both packages publish to **GitHub Packages** (`https://npm.pkg.github.com`).

---

## Prerequisites

- You are on the `main` branch with all changes merged
- CI is green (lint, build, tests all pass)
- You are authenticated with GitHub Packages:
    ```bash
    npm login --registry=https://npm.pkg.github.com
    ```

---

## Step 1 -- Make sure main is up to date

```bash
git checkout main
git pull origin main
```

## Step 2 -- Run the full quality check locally

```bash
npm ci
npm run lint
npm run lib:build
npm run lib:test
```

Fix anything that fails before continuing.

## Step 3 -- Decide the version bump

Follow [Semantic Versioning](https://semver.org/):

| Change type              | Bump  | Example            |
| ------------------------ | ----- | ------------------ |
| Bug fix (this release)   | patch | `0.0.4` -> `0.0.5` |
| New feature, no breaking | minor | `0.0.4` -> `0.1.0` |
| Breaking API change      | major | `0.0.4` -> `1.0.0` |

While the project is pre-1.0, minor bumps are fine for features and patch for fixes.

## Step 4 -- Bump the version in package.json

Bump each package you are releasing. Only bump a package if it has changes since its last release.

### @paya-labs/admin-ui

```bash
npm version patch --no-git-tag-version -w @paya-labs/admin-ui   # or minor / major
```

### @paya-labs/create-admin-ui (if changed)

If `create-admin-ui` depends on the new version of `admin-ui` (e.g. in its template), update that reference first, then bump:

```bash
# Update the admin-ui version in template/package.json if needed
npm version patch --no-git-tag-version -w @paya-labs/create-admin-ui   # or minor / major
```

The `--no-git-tag-version` flag prevents npm from creating per-package commits and tags -- we create a single release commit and tag in the next step instead.

## Step 5 -- Create a single release commit and tag

Since this is a monorepo, create a top-level tag that groups the release:

```bash
# Stage the version bumps
git add packages/admin-ui/package.json packages/create-admin-ui/package.json

# Commit (amend the npm version commit or create a new one)
git commit -m "release: @paya-labs/admin-ui@<version>"

# Create an annotated tag
git tag -a v<version> -m "Release v<version>"
```

Replace `<version>` with the new admin-ui version (e.g. `0.0.5`).

## Step 6 -- Push the commit and tag

```bash
git push origin main
git push origin v<version>
```

## Step 7 -- Build and publish

Always build from a clean state before publishing:

```bash
# Build the library
npm run lib:build

# Publish admin-ui
npm publish -w @paya-labs/admin-ui

# Publish create-admin-ui (if bumped)
npm publish -w @paya-labs/create-admin-ui
```

### Dry run first (recommended)

If you want to verify what will be published without actually publishing:

```bash
npm publish --dry-run -w @paya-labs/admin-ui
```

## Step 8 -- Create a GitHub Release

Go to the repository on GitHub or use the CLI:

```bash
gh release create v<version> \
  --title "v<version>" \
  --notes "## What's Changed

- Fix: Dropdown menus no longer clipped inside modals
- <other changes>

**Full Changelog**: https://github.com/paya-labs/admin-backend/compare/v<previous>...v<version>"
```

This gives the team a clear changelog and a place for release discussion.

## Step 9 -- Verify the release

```bash
# Check the package is available on GitHub Packages
npm view @paya-labs/admin-ui --registry=https://npm.pkg.github.com

# In a consuming project, update and test
npm install @paya-labs/admin-ui@<version>
```

---

## Quick Reference (copy-paste)

```bash
# Full flow for a patch release of admin-ui
git checkout main && git pull origin main
npm ci && npm run lint && npm run lib:build && npm run lib:test

npm version patch --no-git-tag-version -w @paya-labs/admin-ui
git add packages/admin-ui/package.json
git commit -m "release: @paya-labs/admin-ui@$(node -p "require('./packages/admin-ui/package.json').version")"

VERSION=$(node -p "require('./packages/admin-ui/package.json').version")
git tag -a "v${VERSION}" -m "Release v${VERSION}"
git push origin main && git push origin "v${VERSION}"

npm run lib:build
npm publish -w @paya-labs/admin-ui

gh release create "v${VERSION}" --title "v${VERSION}" --generate-notes
```
