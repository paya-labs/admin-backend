# Publishing to GitHub Packages (Private Registry)

This guide explains how to publish `@paya-labs/admin-ui` and `@paya-labs/create-admin-ui` as private packages to GitHub Packages.

## Prerequisites

1. A GitHub account with access to the `flangofas` organization/acctoun
2. A GitHub Personal Access Token (PAT) with the following scopes:
    - `read:packages`
    - `write:packages`
    - `delete:packages` (optional, for unpublishing)

## Setup

### 1. Create a Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "npm-publish")
4. Select the scopes: `read:packages`, `write:packages`
5. Click "Generate token"
6. Copy the token immediately (you won't see it again)

### 2. Configure npm Authentication

Create or edit `~/.npmrc` in your home directory:

```
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
@paya-labs:registry=https://npm.pkg.github.com
```

Replace `YOUR_GITHUB_TOKEN` with your actual PAT.

**Important:** Never commit your token to the repository.

### 3. Verify Authentication

```bash
npm whoami --registry=https://npm.pkg.github.com
```

This should return your GitHub username.

## Publishing

### Build First

```bash
npm run lib:build
```

### Publish Packages

```bash
# Publish the component library
npm publish -w @paya-labs/admin-ui

# Publish the CLI tool
npm publish -w @paya-labs/create-admin-ui
```

### Version Bumping

Before publishing a new version:

```bash
# Patch version (0.1.0 → 0.1.1)
npm version patch -w @paya-labs/admin-ui

# Minor version (0.1.0 → 0.2.0)
npm version minor -w @paya-labs/admin-ui

# Major version (0.1.0 → 1.0.0)
npm version major -w @paya-labs/admin-ui
```

## Installing Private Packages

Team members who need to install these packages must:

### 1. Create their own PAT

Same process as above, but only `read:packages` scope is required for installation.

### 2. Configure npm

Add to `~/.npmrc`:

```
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
@paya-labs:registry=https://npm.pkg.github.com
```

### 3. Install

```bash
npm install @paya-labs/admin-ui
```

Or use the CLI:

```bash
npx @paya-labs/create-admin-ui my-project
```

## CI/CD Setup (DigitalOcean App Platform)

For deploying static sites on DigitalOcean App Platform that depend on private GitHub packages:

### 1. Create a GitHub PAT for CI

Create a PAT with `read:packages` scope (same process as above). This token will be used during builds to install private packages.

### 2. Add Environment Variable in App Platform

1. Go to your App in DigitalOcean App Platform
2. Navigate to **Settings** → **App-Level Environment Variables**
3. Add the following variable:
    - **Key:** `NPM_TOKEN`
    - **Value:** Your GitHub PAT
    - **Encrypt:** Yes (recommended for secrets)

### 3. Configure .npmrc in Your Project

Create a `.npmrc` file in your project root:

```
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
@paya-labs:registry=https://npm.pkg.github.com
```

This file uses the `NPM_TOKEN` environment variable, so it's safe to commit.

### 4. App Spec Configuration

In your `app.yaml` or via the App Platform UI:

```yaml
name: my-admin-app
static_sites:
    - name: web
      github:
          repo: flangofas/my-admin-app
          branch: main
      build_command: npm ci && npm run build
      output_dir: dist
      envs:
          - key: NPM_TOKEN
            value: ${NPM_TOKEN}
            scope: BUILD_TIME
            type: SECRET
```

**Note:** The `scope: BUILD_TIME` ensures the token is only available during the build phase, not at runtime.

### 5. Alternative: Build Command with .npmrc

If you prefer not to commit `.npmrc`, use a build command that creates it:

```yaml
build_command: |
    echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc
    echo "@paya-labs:registry=https://npm.pkg.github.com" >> .npmrc
    npm ci && npm run build
```

## Troubleshooting

### 403 Forbidden

- Verify your PAT has the correct scopes
- Ensure the package name matches the repository owner (`@paya-labs`)
- Check that the repository exists and you have write access

### 404 Not Found (when installing)

- Verify the package was published successfully
- Check that your `~/.npmrc` has the correct registry configuration
- Ensure your PAT has `read:packages` scope

### Package name mismatch

The package name in `package.json` must be scoped to match the GitHub org/user:

```json
{
    "name": "@paya-labs/admin-ui"
}
```
