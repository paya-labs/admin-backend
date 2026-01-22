# Demo App

Development playground for testing `@flangofas/admin-ui` components.

## Why This Exists

This demo app uses the **local copy** of `admin-ui` via npm workspaces. This means you can:

- Test component changes instantly without publishing
- Debug issues in a real app context
- Validate fixes before releasing a new version

Changes to `packages/admin-ui/src/` are reflected here after rebuilding.

## Usage

```bash
# Terminal 1: Watch & rebuild admin-ui on changes
npm run lib:dev

# Terminal 2: Run the demo app
npm run demo:dev
```

Or build once and run:

```bash
npm run lib:build
npm run demo:dev
```

## Pages

- **Dashboard** (`/`) - Overview with sample cards
- **Components** (`/components`) - Interactive showcase of all components

## How It Works

The `package.json` specifies:

```json
"@flangofas/admin-ui": "*"
```

npm workspaces resolves this to the local `packages/admin-ui` directory (symlinked), not the npm registry.
