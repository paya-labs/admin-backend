# Admin UI Monorepo

A Vue 3 admin UI components library and CLI tool for building backoffice applications.

## Packages

| Package | Description |
| ------- | ----------- |
| [@flangofas/admin-ui](./packages/admin-ui) | Vue 3 admin UI components library |
| [@flangofas/create-admin-ui](./packages/create-admin-ui) | CLI to scaffold new admin projects |
| [demo](./packages/demo) | Development playground (local testing) |

## Quick Start

### Create a New Admin Project

```bash
npx @flangofas/create-admin-ui my-client-admin
cd my-client-admin
npm install
npm run dev
```

### Use Components Directly

```bash
npm install @flangofas/admin-ui
```

```javascript
import { AppButton, AppTable, AdminLayout } from '@flangofas/admin-ui';
import '@flangofas/admin-ui/styles';
```

See the [@flangofas/admin-ui README](./packages/admin-ui/README.md) for full component documentation.

## Tech Stack

- **Vue 3.5** with `<script setup>` syntax
- **JavaScript with JSDoc** for type safety
- **Tailwind CSS v4** with `@theme` tokens
- **Vite** for build tooling
- **Vitest** for component testing

## Development

```bash
npm install            # Install dependencies
npm run lib:dev        # Watch build admin-ui library
npm run lib:build      # Build admin-ui library
npm run lib:test       # Run component unit tests
npm run demo:dev       # Start demo dev server
npm run demo:build     # Build demo app
npm run lint           # Check formatting and linting
npm run lint:fix       # Fix formatting and linting
```

## Project Structure

```
packages/
├── admin-ui/             # @flangofas/admin-ui
├── create-admin-ui/      # @flangofas/create-admin-ui CLI
└── demo/                 # Development playground
```

## Publishing

See [PUBLISHING.md](./PUBLISHING.md) for instructions on publishing to GitHub Packages and CI/CD setup.

## License

MIT