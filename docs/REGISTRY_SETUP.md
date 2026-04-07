# Registry Setup (GitHub Packages)

This guide covers authentication, CI/CD configuration, and troubleshooting for the `@paya-labs` private registry on GitHub Packages.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Publishing](#publishing)
- [Installing Private Packages](#installing-private-packages)
- [GitHub Actions Workflows](#github-actions-workflows)
- [CI/CD Setup (DigitalOcean App Platform)](#cicd-setup-digitalocean-app-platform)
- [Troubleshooting](#troubleshooting)

## Prerequisites

1. A GitHub account with access to the `paya-labs` organization
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

For the full step-by-step release workflow (version bumping, tagging, building, publishing, and creating GitHub releases), see [RELEASE_GUIDE.md](./RELEASE_GUIDE.md).

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

## GitHub Actions Workflows

This section explains how consumer projects can set up GitHub Actions to install `@paya-labs/admin-ui` from GitHub Packages (private registry).

### 1. Create a Personal Access Token (PAT)

The consumer project needs a PAT with `read:packages` scope to pull private packages:

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Name: `github-packages-read` (or similar)
4. Select scope: `read:packages`
5. Click **Generate token**
6. Copy the token immediately

### 2. Add the Secret to Consumer Repository

1. Go to your consumer project repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following:
    - **Name:** `NPM_TOKEN`
    - **Secret:** Your PAT from step 1

### 3. Configure the Workflow

Create `.github/workflows/ci.yml` in your consumer project:

```yaml
name: CI

on:
    push:
        branches: [main]
    pull_request:
        branches: [main]

jobs:
    build:
        runs-on: ubuntu-latest

        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: '24'
                  cache: 'npm'
                  registry-url: 'https://npm.pkg.github.com'
                  scope: '@paya-labs'

            - name: Install dependencies
              run: npm ci
              env:
                  NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

            - name: Build
              run: npm run build

            - name: Test
              run: npm test
```

**Key points:**

- `registry-url` and `scope` in `setup-node` configure npm to use GitHub Packages for `@paya-labs` scoped packages
- `NODE_AUTH_TOKEN` environment variable authenticates the `npm ci` command

### 4. Alternative: Using .npmrc File

If you prefer to commit an `.npmrc` file to your consumer project:

**`.npmrc` (safe to commit):**

```
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
@paya-labs:registry=https://npm.pkg.github.com
```

**Workflow (simplified):**

```yaml
- name: Install dependencies
  run: npm ci
  env:
      NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

The `.npmrc` file uses the `NODE_AUTH_TOKEN` environment variable, so no secrets are exposed in the file.

### 5. Using with GitHub Pages Deployment

Example workflow that builds and deploys to GitHub Pages:

```yaml
name: Deploy to GitHub Pages

on:
    push:
        branches: [main]

jobs:
    build-and-deploy:
        runs-on: ubuntu-latest
        permissions:
            contents: read
            pages: write
            id-token: write

        steps:
            - name: Checkout
              uses: actions/checkout@v4

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: '24'
                  cache: 'npm'
                  registry-url: 'https://npm.pkg.github.com'
                  scope: '@paya-labs'

            - name: Install dependencies
              run: npm ci
              env:
                  NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

            - name: Build
              run: npm run build

            - name: Setup Pages
              uses: actions/configure-pages@v4

            - name: Upload artifact
              uses: actions/upload-pages-artifact@v3
              with:
                  path: './dist'

            - name: Deploy to GitHub Pages
              uses: actions/deploy-pages@v4
```

### Troubleshooting GitHub Actions

**Error: 401 Unauthorized during `npm ci`**

- Verify `NPM_TOKEN` secret is set correctly in repository settings
- Ensure the PAT has `read:packages` scope
- Check that the PAT hasn't expired

**Error: 404 Not Found for package**

- Verify the package is published to GitHub Packages
- Ensure `@paya-labs:registry=https://npm.pkg.github.com` is configured
- Check that the PAT owner has access to the `paya-labs` organization

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
          repo: paya-labs/my-admin-app
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
