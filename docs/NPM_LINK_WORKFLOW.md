# npm link Workflow for @paya-labs/admin-ui

How to switch between the local development copy and the published registry version of `@paya-labs/admin-ui`.

## Link (use local version)

```bash
npm link ~/path/to/admin-ui/packages/admin-ui
```

This replaces the registry version with a symlink to the local copy. Changes in the local package are reflected immediately.

## Unlink (go back to registry version)

```bash
npm uninstall @paya-labs/admin-ui
npm install @paya-labs/admin-ui
```

The uninstall removes the symlink, and the install fetches the latest version from the npm registry.