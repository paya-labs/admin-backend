# @paya-labs/admin-ui

Vue 3 admin UI components for building backoffice applications.

## Installation

```bash
npm install @paya-labs/admin-ui
```

## Setup

### Option 1: Plugin (Global Registration)

```javascript
import { createApp } from 'vue';
import { AdminUIPlugin } from '@paya-labs/admin-ui';
import '@paya-labs/admin-ui/styles';

const app = createApp(App);
app.use(AdminUIPlugin);
app.mount('#app');
```

### Option 2: Individual Imports

```javascript
import { AppButton, AppTable, AdminLayout } from '@paya-labs/admin-ui';
import '@paya-labs/admin-ui/styles';
```

## Components

| Component               | Description                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| `AppButton`             | Button with variants and loading state                                                     |
| `AppInput`              | Text input with label and validation                                                       |
| `AppTextarea`           | Multi-line text input                                                                      |
| `AppSelect`             | Select dropdown                                                                            |
| `AppDatePicker`         | Date or time field with popover picker                                                     |
| `AppDatePanel`          | Month grid with month/year drill-up                                                        |
| `AppCalendarNavigation` | Today / prev / heading / next toolbar; the heading opens `AppDatePanel` when `date` is set |
| `AppBadge`              | Status badge with variants                                                                 |
| `AppCard`               | Stats/info card with trend indicators                                                      |
| `AppTable`              | Data table with sorting and pagination                                                     |
| `AppHeader`             | Top bar: hamburger plus `header-left/center/right/end` slots (also teleport targets)       |
| `AppSidebar`            | Navigation sidebar with collapse and a user menu (theme switch, sign out)                  |
| `AppModal`              | Modal dialog                                                                               |
| `AppForm`               | Dynamic form generator                                                                     |
| `AppIcon`               | Icon component with built-in icons                                                         |
| `AppToastContainer`     | Toast notifications container                                                              |
| `AdminLayout`           | Main layout with sidebar and header                                                        |

### Component notes

- `AppHeader` renders nothing of its own besides the sidebar hamburger. Its four regions are named slots on `AppHeader` and `AdminLayout` (`header-left`, `header-center`, `header-right`, `header-end`) and stay reachable as teleport targets with the same ids. The theme toggle that used to sit at the far right is gone; `AppSidebar` offers it in the user menu instead.
- `AppSidebar` user menu carries the theme switch (`Theme: Light / Dark / System`, cycling on click) above Sign out. It uses the shared `useTheme` state, so nothing needs wiring from the consumer.
- `AppCalendarNavigation` renders `title` itself: as a jump-to-date button when `date` (ISO anchor of the visible range) is passed, otherwise as a plain `<h1>`. Earlier versions never rendered `title`; drop any heading you rendered next to it.
- Below 768px (`useBreakpoint().isMobile`) `AppDatePicker` and `AppCalendarNavigation` open their content in a bottom sheet instead of the anchored popover; the time list has no typed input there.
- `AppDatePanel` `fluid` (default `false`) drops the fixed width, chrome and footer so the grid fills its container, as the bottom sheet does.
- `AppDatePicker` emits `YYYY-MM-DD` in date mode and `HH:mm` in time mode, empty string when cleared. `min` / `max` (ISO dates) apply to date mode only. In time mode `step` is the list interval in minutes (default 15) and `from` (`HH:mm`) starts the list one step after that time and labels each entry with its duration, e.g. for an end-time field.

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
