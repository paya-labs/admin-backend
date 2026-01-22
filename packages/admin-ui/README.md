# @flangofas/admin-ui

Vue 3 admin UI components for building backoffice applications.

## Installation

```bash
npm install @flangofas/admin-ui
```

## Setup

### Option 1: Plugin (Global Registration)

```javascript
import { createApp } from 'vue';
import { AdminUIPlugin } from '@flangofas/admin-ui';
import '@flangofas/admin-ui/styles';

const app = createApp(App);
app.use(AdminUIPlugin);
app.mount('#app');
```

### Option 2: Individual Imports

```javascript
import { AppButton, AppTable, AdminLayout } from '@flangofas/admin-ui';
import '@flangofas/admin-ui/styles';
```

## Components

| Component           | Description                            |
| ------------------- | -------------------------------------- |
| `AppButton`         | Button with variants and loading state |
| `AppInput`          | Text input with label and validation   |
| `AppTextarea`       | Multi-line text input                  |
| `AppSelect`         | Select dropdown                        |
| `AppBadge`          | Status badge with variants             |
| `AppCard`           | Stats/info card with trend indicators  |
| `AppTable`          | Data table with sorting and pagination |
| `AppHeader`         | Top header with user info and search   |
| `AppSidebar`        | Navigation sidebar with collapse       |
| `AppModal`          | Modal dialog                           |
| `AppForm`           | Dynamic form generator                 |
| `AppIcon`           | Icon component with built-in icons     |
| `AppToastContainer` | Toast notifications container          |
| `AdminLayout`       | Main layout with sidebar and header    |

## Composables

| Composable      | Description                             |
| --------------- | --------------------------------------- |
| `useTheme`      | Dark/light/system theme management      |
| `useSidebar`    | Sidebar state (open, collapsed, mobile) |
| `useToast`      | Toast notification system               |
| `useAuth`       | Authentication state management         |
| `useApi`        | HTTP client with error handling         |
| `useCrud`       | CRUD operations helper                  |
| `usePagination` | Pagination state and controls           |

## Directives

| Directive         | Description                      |
| ----------------- | -------------------------------- |
| `v-click-outside` | Detect clicks outside an element |

## Theme Customization

The base theme uses CSS custom properties. Override them in your CSS:

```css
:root {
    --color-primary: #3b82f6;
    --color-secondary: #64748b;
    --color-accent: #8b5cf6;
    --color-background: #ffffff;
    --color-surface: #f8fafc;
    --color-text: #1e293b;
    --color-text-muted: #64748b;
    --color-border: #e2e8f0;
    --color-success: #22c55e;
    --color-warning: #f59e0b;
    --color-danger: #ef4444;
}
```

See `src/themes/base.css` for all available tokens.

## Development

```bash
# From monorepo root
npm run lib:dev        # Watch build
npm run lib:build      # Production build
npm run lib:test       # Run tests
```

## License

MIT
