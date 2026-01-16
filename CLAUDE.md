# Admin Backend - Multi-Tenant Admin Platform

## Project Overview

This is a centralized admin dashboard platform where multiple clients (websites/apps) can log in and get personalized dashboards. Each client is a "module" with its own pages, components, and configuration.

## Tech Stack

- **Vue 3.5** with `<script setup>` syntax
- **JavaScript with JSDoc** for type safety
- **Tailwind CSS v4** with `@theme` tokens
- **Vite** for build tooling
- **Axios** for HTTP requests
- **Vue Router** for routing

## Architecture Principles

1. **Module-based** - Each client is a "module" with its own pages, components, and configuration
2. **Strong core framework** - Shared components, composables, and layouts that all modules use
3. **Configuration-driven** - Navigation, theming, and API endpoints defined in module config
4. **White-label ready** - Each module can have custom branding via theme tokens
5. **JSDoc type annotations** - Full type safety via JSDoc comments with `checkJs` enabled

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

/**
 * @typedef {object} NavigationItem
 * @property {string} label
 * @property {string} [icon]
 * @property {string} route
 * @property {NavigationItem[]} [children]
 */

export {};
```

### Using Types

```javascript
// Import types from other files
/** @typedef {import('./types/module.js').ModuleConfig} ModuleConfig */

/** @type {ModuleConfig | null} */
let config = null;

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string, user: User }>}
 */
async function login(email, password) {
    // ...
}
```

### Generic Functions

```javascript
/**
 * @template T
 * @param {T[]} items
 * @param {(item: T) => boolean} predicate
 * @returns {T | undefined}
 */
function find(items, predicate) {
    return items.find(predicate);
}
```

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

## Adding a New Client Module

1. Copy `src/modules/_template` to `src/modules/{client-name}`
2. Update `module.config.js` with:
    - Module ID, name, logo
    - Theme colors
    - API base URL
    - Navigation items
3. Create pages for each navigation route
4. Define client-specific actions in `/actions`
5. Register the module routes in router

## Theme System

Themes use CSS custom properties defined in `src/themes/base.css`:

- `--color-primary`, `--color-secondary`, `--color-accent`
- `--color-background`, `--color-surface`
- `--color-text`, `--color-text-muted`
- `--color-border`
- `--color-success`, `--color-warning`, `--color-danger`

Modules can override these via `theme` in `module.config.js`.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Check formatting and linting
npm run lint-fix     # Fix formatting and linting
```

## Key Files

- `ADMIN_SCAFOLDING_INSTRUCTIONS.md` - Full scaffolding documentation with implementation details
- `jsconfig.json` - JavaScript config with `checkJs: true` for type checking
- `src/core/types/` - JSDoc type definitions for module config, tables, forms, workflows
