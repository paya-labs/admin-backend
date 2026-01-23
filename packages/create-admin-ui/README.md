# @paya-labs/create-admin-ui

CLI to scaffold new admin projects using [@paya-labs/admin-ui](https://github.com/flangofas/admin-ui).

## Usage

```bash
npx @paya-labs/create-admin-ui my-project
cd my-project
npm install
npm run dev
```

## What's Included

The generated project includes:

- Vue 3 + Vite setup
- @paya-labs/admin-ui components
- Tailwind CSS v4
- Vue Router
- ESLint + Prettier configuration
- Example Dashboard page

## Project Structure

```
my-project/
├── src/
│   ├── main.js           # App entry point
│   ├── App.vue           # Root component with AdminLayout
│   ├── module.config.js  # Theme, navigation, API config
│   ├── router/
│   │   └── index.js      # Routes
│   └── pages/
│       └── Dashboard.vue # Example page
├── index.html
├── vite.config.js
├── package.json
└── ...config files
```

## License

MIT
