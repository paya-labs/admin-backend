# {{PROJECT_NAME}} Admin

Admin dashboard built with [@paya-labs/admin-ui](https://github.com/flangofas/admin-ui).

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── main.js              # App entry point
├── App.vue              # Root component
├── style.css            # Custom styles
├── module.config.js     # Module configuration (theme, navigation, API)
├── router/
│   └── index.js         # Vue Router setup
└── pages/
    └── Dashboard.vue    # Dashboard page
```

## Configuration

Edit `src/module.config.js` to customize:

- **theme**: Primary, secondary, and accent colors
- **navigation**: Sidebar menu items
- **api.baseUrl**: API endpoint base URL

## Available Components

Import from `@paya-labs/admin-ui`:

- `AppButton`, `AppInput`, `AppSelect`
- `AppTable`, `AppCard`, `AppBadge`
- `AppModal`, `AppForm`
- `AppHeader`, `AppSidebar`
- `AdminLayout`

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Check formatting and linting
npm run lint-fix # Fix formatting and linting
```
