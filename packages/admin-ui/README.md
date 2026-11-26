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

| Component               | Description                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `AppButton`             | Button with variants and loading state; `to` makes it a `RouterLink`                 |
| `AppInput`              | Text input with label and validation                                                 |
| `AppTextarea`           | Multi-line text input                                                                |
| `AppSelect`             | Select dropdown                                                                      |
| `AppDatePicker`         | Date or time field with popover picker                                               |
| `AppDatePanel`          | Month grid with month/year drill-up                                                  |
| `AppCalendarNavigation` | Prev / heading / next toolbar; the heading opens `AppDatePanel` when `date` is set   |
| `AppBadge`              | Status badge with variants                                                           |
| `AppCard`               | Stats/info card with trend indicators                                                |
| `AppPageHeader`         | Page title with optional description, breadcrumb and right-hand actions slot         |
| `AppTable`              | Data table with sorting and pagination                                               |
| `AppRowActionMenu`      | Shared ⋯ menu for table rows, anchored to the trigger; bottom sheet on phones        |
| `AppRowActionMenuItem`  | Entry in `AppRowActionMenu`: button, RouterLink (`to`) or link (`href`)              |
| `AppHeader`             | Top bar: hamburger plus `header-left/center/right/end` slots (also teleport targets) |
| `AppSidebar`            | Navigation sidebar with collapse and a user menu (theme switch, sign out)            |
| `AppModal`              | Modal dialog                                                                         |
| `AppConfirmModal`       | Confirm dialog on `AppModal`: body slot, Cancel and a primary or `danger` action     |
| `AppBottomSheet`        | Phone bottom sheet: title bar with a Done button, `secondary` slot left of the title |
| `AppForm`               | Dynamic form generator                                                               |
| `AppIcon`               | Icon component with built-in icons                                                   |
| `AppToastContainer`     | Toast notifications container                                                        |
| `AdminLayout`           | Main layout with sidebar and header                                                  |

### Component notes

- `AppHeader` renders nothing of its own besides the sidebar hamburger. Its four regions are named slots on `AppHeader` and `AdminLayout` (`header-left`, `header-center`, `header-right`, `header-end`) and stay reachable as teleport targets with the same ids. The theme toggle that used to sit at the far right is gone; `AppSidebar` offers it in the user menu instead.
- `AppSidebar` user menu carries the theme switch (`Theme: Light / Dark / System`, cycling on click) above Sign out. It uses the shared `useTheme` state, so nothing needs wiring from the consumer.
- `AppCalendarNavigation` renders `title` itself: as a jump-to-date button when `date` (ISO anchor of the visible range) is passed, otherwise as a plain `<h1>`. Earlier versions never rendered `title`; drop any heading you rendered next to it. It no longer renders a Today button (nor emits `today`): place your own where it suits the page, e.g. after the view tabs, and call the calendar's `today()`. The date popover opens centered under the heading.
- `AppCalendar` opens time-grid views at the current hour minus one (in its timezone, rounded down to the hour) and keeps the scroll on prev / next / Today and when switching between time-grid views (Day, Week, Work Week); coming from Month or Agenda it opens at the current hour minus one again. Earlier versions opened at the top of the day and scrolled back there on every date change. Pass `scrollTime` (`'HH:mm:ss'`) for a fixed opening time, `scroll-time-reset` to scroll back to it on every date change.
- Below 768px (`useBreakpoint().isMobile`) `AppDatePicker` and `AppCalendarNavigation` open their content in a bottom sheet instead of the anchored popover; the time list has no typed input there.
- Below 768px `AppModal` at `size="full"` goes edge to edge with the footer pinned at the bottom; every other size becomes a bottom sheet (full width, aligned to the bottom, top corners rounded, padded for `env(safe-area-inset-bottom)`). To make footer buttons share the sheet's width, wrap them in a group with `max-md:w-full max-md:[&>*]:flex-1`, e.g. `<div class="flex gap-3 max-md:w-full max-md:[&>*]:flex-1">`. `AppDrawer` goes full width below 768px.
- `AppBottomSheet` is controlled: pass `open` and `title`, and set `open` to false on `close`, which fires on Done, a backdrop tap and Escape. The default slot is the body; the `secondary` slot sits left of the title (e.g. a Clear button). It teleports to `body`, locks body scroll while open and keeps Tab inside the sheet (buttons and inputs only). It does not move focus on open or restore it on close. `AppDatePicker` and `AppCalendarNavigation` use it below 768px.
- `AppDatePanel` `fluid` (default `false`) drops the fixed width, chrome and footer so the grid fills its container, as the bottom sheet does.
- `AppDatePicker` emits `YYYY-MM-DD` in date mode and `HH:mm` in time mode, empty string when cleared. `min` / `max` (ISO dates) apply to date mode only. In time mode `step` is the list interval in minutes (default 15) and `from` (`HH:mm`) starts the list one step after that time and labels each entry with its duration, e.g. for an end-time field.
- `AppIcon` draws the registry in `src/icons` (see the demo's Icons page for every name). Icons are 1.5px outlines on a 24px grid unless their definition sets `viewBox` or `solid: true`; solid icons fill with `currentColor` using the even-odd rule. `exclamation-triangle-solid`, `pause`, `apple` and `linkedin` are solid. An icon with `layers` draws each layer in its own fixed colour, e.g. the `google` logo. `name` is typed as `IconName` (exported), as are `NavigationItem.icon` and `AppRowActionMenuItem`'s `icon`, so a misspelt name fails type-checking; type icon names you keep in data as `IconName` too. An unknown name at runtime still renders a faded placeholder with an "Icon not found" title.
- `AppConfirmModal` (`v-model`, `title`, `confirmLabel` = `Confirm`, `cancelLabel` = `Cancel`, `danger`, `loading`) emits `confirm` and leaves closing to you, so close it once the action succeeds. Cancel closes it; replace that button through the `cancel` slot. While `loading` the action shows a spinner, Cancel is disabled and the backdrop and Escape do not close it. Below 768px the actions stack full width, action first and Cancel last.
- `AppRowActionMenu` is rendered once per page and moves to whichever row is open; pair it with `useRowMenu`. It is teleported to `body`, opens below the trigger right-aligned and flips above when there is more room there. With `sheet` it becomes a bottom sheet with a backdrop below 768px; `cancel` adds a Cancel button to that sheet. Opening focuses the first item, Escape or a click on the backdrop emits `close`, and focus returns to the trigger once `trigger` is cleared. `menu-class` replaces the default `w-48` width. `AppRowActionMenuItem` takes `icon`, `danger`, `to` and `href`, and is 44px tall on phones. The menu does not close itself when an item is clicked: call `closeMenu` in the item's handler.

    ```vue
    <script setup lang="ts">
    const { menuRow, menuTrigger, toggleMenu, closeMenu } = useRowMenu<User>();
    </script>

    <AppTable :columns="columns" :rows="users">
        <template #cell-menu="{ row }">
            <AppButton variant="ghost" size="sm" icon-only aria-label="Actions" @click="toggleMenu(row, $event)">
                <AppIcon name="ellipsis-horizontal" size="sm" />
            </AppButton>
        </template>
    </AppTable>
    <AppRowActionMenu :trigger="menuTrigger" sheet cancel @close="closeMenu">
        <AppRowActionMenuItem icon="pencil" :to="`/users/${menuRow?.id}`" @click="closeMenu">Edit</AppRowActionMenuItem>
        <AppRowActionMenuItem icon="trash" danger @click="remove(menuRow)">Delete</AppRowActionMenuItem>
    </AppRowActionMenu>
    ```

    In a `#mobile-row` slot use `@click.stop` on the trigger so the row's own click does not fire.

- `AppInput` `revealable` (default `false`) adds a show/hide eye button to a `type="password"` field; it toggles the input between `password` and `text`. The button takes the suffix position, so any `#suffix` slot content is not rendered on a revealable password field. Other types ignore the prop.
- `AppButton` `to` (any `RouterLink` `to` value) renders the button as a `RouterLink` with the same variant and size styles, so it navigates without a click handler. A link cannot be disabled, so with `disabled` or `loading` it renders as a disabled `<button>` instead.
- `AppPageHeader` takes `title`, optional `description` and optional `breadcrumbs: { label, to? }[]`. Crumbs with `to` render as `RouterLink`s, except the last one, which is plain text with `aria-current="page"`. The default slot holds the page actions; it sits to the right of the title and wraps below it under 768px. The title is an `<h1>`.

## Composables

| Composable      | Description                                                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `useTheme`      | Dark/light/system theme management                                                                                           |
| `useSidebar`    | Sidebar state (open, collapsed, mobile)                                                                                      |
| `useToast`      | Toast notification system                                                                                                    |
| `useAuth`       | Authentication state management                                                                                              |
| `useApi`        | HTTP client with error handling                                                                                              |
| `useCrud`       | CRUD operations helper                                                                                                       |
| `usePagination` | Pagination state and controls                                                                                                |
| `useRowMenu`    | Open row and trigger for `AppRowActionMenu`; `toggleMenu(row, event)` closes it when the open row's trigger is clicked again |

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
