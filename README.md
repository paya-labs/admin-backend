# Admin UI Monorepo

A Vue 3 admin UI components library and CLI tool for building backoffice applications.

## Packages

| Package                                                  | Description                            |
| -------------------------------------------------------- | -------------------------------------- |
| [@paya-labs/admin-ui](./packages/admin-ui)               | Vue 3 admin UI components library      |
| [@paya-labs/create-admin-ui](./packages/create-admin-ui) | CLI to scaffold new admin projects     |
| [demo](./packages/demo)                                  | Development playground (local testing) |

## Quick Start

### Create a New Admin Project

```bash
npx @paya-labs/create-admin-ui my-client-admin
cd my-client-admin
npm install
npm run dev
```

### Use Components Directly

```bash
npm install @paya-labs/admin-ui
```

```javascript
import { AppButton, AppTable, AdminLayout } from '@paya-labs/admin-ui';
import '@paya-labs/admin-ui/styles';
```

See the [@paya-labs/admin-ui README](./packages/admin-ui/README.md) for full component documentation.

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
├── admin-ui/             # @paya-labs/admin-ui
├── create-admin-ui/      # @paya-labs/create-admin-ui CLI
└── demo/                 # Development playground
```

## Publishing

- [RELEASE_GUIDE.md](./docs/RELEASE_GUIDE.md) -- Step-by-step release workflow (version bump, tag, publish)
- [REGISTRY_SETUP.md](./docs/REGISTRY_SETUP.md) -- Registry auth setup, CI/CD configuration, and troubleshooting

## License

MIT
