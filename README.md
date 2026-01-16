# Admin Backend - Multi-Tenant Admin Platform

A centralized admin dashboard platform where multiple clients (websites/apps) can log in and get personalized dashboards. Each client is a "module" with its own pages, components, and configuration.

## Tech Stack

- **Vue 3.5** with `<script setup>` syntax
- **JavaScript with JSDoc** for type safety
- **Tailwind CSS v4** with `@theme` tokens
- **Vite** for build tooling
- **Axios** for HTTP requests
- **Vue Router** for routing

## Getting Started

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Check formatting and linting
npm run lint-fix     # Fix formatting and linting
```

## Architecture Principles

1. **Module-based** - Each client is a "module" with its own pages, components, and configuration
2. **Strong core framework** - Shared components, composables, and layouts that all modules use
3. **Configuration-driven** - Navigation, theming, and API endpoints defined in module config
4. **White-label ready** - Each module can have custom branding via theme tokens
5. **JSDoc type annotations** - Full type safety via JSDoc comments with `checkJs` enabled

## Project Structure

```
src/
├── core/                    # Shared framework code
│   ├── components/          # Reusable UI components (AppTable, AppForm, etc.)
│   ├── composables/         # Vue composables (useAuth, useApi, useCrud, etc.)
│   ├── layouts/             # Page layouts (AdminLayout)
│   ├── types/               # JSDoc type definitions (.js files)
│   └── utils/               # Helper functions
├── modules/                 # Client-specific modules
│   └── _template/           # Template for new modules
│       ├── module.config.js # Module configuration
│       ├── routes.js        # Module routes
│       ├── pages/           # Module pages
│       ├── components/      # Module-specific components
│       └── actions/         # Module-specific actions/workflows
├── themes/                  # CSS themes
│   └── base.css            # Base theme with Tailwind v4 @theme tokens
├── router/                  # Vue Router setup
│   └── index.js
├── pages/                   # Global pages (Login)
├── App.vue
└── main.js
```

## Core Components

| Component        | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `AppTable.vue`   | Data table with sorting, pagination, selection, and actions |
| `AppForm.vue`    | Dynamic form generator                                      |
| `AppCard.vue`    | Stats/info card with trend indicators                       |
| `AppModal.vue`   | Modal dialog                                                |
| `AppButton.vue`  | Button with variants and loading state                      |
| `AppInput.vue`   | Text input with label and validation                        |
| `AppSelect.vue`  | Select dropdown                                             |
| `AppBadge.vue`   | Status badge                                                |
| `AppSidebar.vue` | Navigation sidebar                                          |
| `AppHeader.vue`  | Top header with user info                                   |

## Core Composables

| Composable      | Description                                                         |
| --------------- | ------------------------------------------------------------------- |
| `useAuth`       | Authentication state and methods (login, logout, fetchUser)         |
| `useApi`        | Axios wrapper with auth tokens and error handling                   |
| `useCrud`       | Generic CRUD operations for any entity                              |
| `usePagination` | Pagination state management                                         |
| `useWorkflow`   | Multi-step workflow execution (confirm, form, api, toast, redirect) |
| `useTheme`      | Runtime theme switching via CSS custom properties                   |

---

## Adding a New Client Module

See the full guide: **[Adding a New Client Module](docs/adding-a-new-client-module.md)**

Quick steps:

1. Copy `src/modules/_template` to `src/modules/{client-name}`
2. Configure `module.config.js` (id, name, theme, API, navigation)
3. Define routes in `routes.js`
4. Create pages for each route
5. Register module routes in `src/router/index.js`

---

## Theme System

Themes use CSS custom properties defined in `src/themes/base.css`:

| Token                | Description            |
| -------------------- | ---------------------- |
| `--color-primary`    | Primary brand color    |
| `--color-secondary`  | Secondary color        |
| `--color-accent`     | Accent/highlight color |
| `--color-background` | Page background        |
| `--color-surface`    | Card/panel background  |
| `--color-text`       | Primary text color     |
| `--color-text-muted` | Secondary text color   |
| `--color-border`     | Border color           |
| `--color-success`    | Success state          |
| `--color-warning`    | Warning state          |
| `--color-danger`     | Error/danger state     |

Modules override these via the `theme` property in `module.config.js`. The `useTheme` composable applies them at runtime.

## Type System (JSDoc)

This project uses **JSDoc annotations** for type safety. The `jsconfig.json` has `checkJs: true` enabled, providing full type checking in your editor.

### Defining Types

```javascript
// In src/core/types/module.js
/**
 * @typedef {object} ModuleConfig
 * @property {string} id
 * @property {string} name
 * @property {string} [logo]
 * @property {ThemeConfig} [theme]
 * @property {{ baseUrl: string }} api
 * @property {NavigationItem[]} navigation
 */

export {};
```

### Using Types

```javascript
/** @typedef {import('@/core/types/module.js').ModuleConfig} ModuleConfig */

/** @type {ModuleConfig} */
const config = {
    /* ... */
};
```

## Key Files

| File                     | Description                                                        |
| ------------------------ | ------------------------------------------------------------------ |
| `jsconfig.json`          | JavaScript config with `checkJs: true` for type checking           |
| `src/core/types/`        | JSDoc type definitions for module config, tables, forms, workflows |
| `src/modules/_template/` | Template to copy when creating new client modules                  |
| `src/themes/base.css`    | Base theme with Tailwind v4 `@theme` tokens                        |
