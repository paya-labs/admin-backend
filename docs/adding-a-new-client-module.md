# Adding a New Client Module

Follow this workflow to add a new client to the platform.

## Step 1: Copy the Template

```bash
cp -r src/modules/_template src/modules/acme
```

Your new module structure:

```
src/modules/acme/
├── module.config.js    # Client configuration
├── routes.js           # Client routes
├── pages/              # Client pages
│   └── Dashboard.vue
├── components/         # Client-specific components
└── actions/            # Client-specific workflows
```

## Step 2: Configure the Module

Edit `src/modules/acme/module.config.js`:

```javascript
/** @typedef {import('@/core/types/module.js').ModuleConfig} ModuleConfig */

/** @type {ModuleConfig} */
const config = {
    id: 'acme',
    name: 'ACME Corp',
    logo: '/logos/acme.svg',

    // Custom branding (optional - falls back to base theme)
    theme: {
        primary: '#6366f1', // Indigo
        accent: '#f59e0b', // Amber
    },

    // API configuration
    api: {
        baseUrl: 'https://api.acme.com/v1',
    },

    // Sidebar navigation
    navigation: [
        { label: 'Dashboard', icon: '📊', route: 'acme-dashboard' },
        { label: 'Orders', icon: '📦', route: 'acme-orders' },
        { label: 'Customers', icon: '👥', route: 'acme-customers' },
        { label: 'Reports', icon: '📈', route: 'acme-reports' },
        { label: 'Settings', icon: '⚙️', route: 'acme-settings' },
    ],
};

export default config;
```

## Step 3: Define Routes

Edit `src/modules/acme/routes.js`:

```javascript
import AdminLayout from '@/core/layouts/AdminLayout.vue';

const routes = [
    {
        path: '/acme',
        component: AdminLayout,
        meta: { module: 'acme' },
        children: [
            {
                path: '',
                redirect: { name: 'acme-dashboard' },
            },
            {
                path: 'dashboard',
                name: 'acme-dashboard',
                component: () => import('./pages/Dashboard.vue'),
            },
            {
                path: 'orders',
                name: 'acme-orders',
                component: () => import('./pages/Orders.vue'),
            },
            {
                path: 'orders/:id',
                name: 'acme-order-detail',
                component: () => import('./pages/OrderDetail.vue'),
            },
            {
                path: 'customers',
                name: 'acme-customers',
                component: () => import('./pages/Customers.vue'),
            },
            {
                path: 'reports',
                name: 'acme-reports',
                component: () => import('./pages/Reports.vue'),
            },
            {
                path: 'settings',
                name: 'acme-settings',
                component: () => import('./pages/Settings.vue'),
            },
        ],
    },
];

export default routes;
```

## Step 4: Create Pages

Create a page for each route. Example `src/modules/acme/pages/Orders.vue`:

```vue
<script setup>
import { onMounted } from 'vue';
import AppTable from '@/core/components/AppTable.vue';
import AppButton from '@/core/components/AppButton.vue';
import { useCrud } from '@/core/composables/useCrud.js';

/**
 * @typedef {object} Order
 * @property {string} id
 * @property {string} customerName
 * @property {string} status
 * @property {number} total
 * @property {string} createdAt
 */

const { items, isLoading, fetchAll, remove } = useCrud({ endpoint: '/orders' });

/** @type {import('@/core/types/table.js').TableColumn[]} */
const columns = [
    { key: 'id', label: 'Order ID', width: '120px' },
    { key: 'customerName', label: 'Customer' },
    { key: 'status', label: 'Status' },
    { key: 'total', label: 'Total', format: 'currency', align: 'right' },
    { key: 'createdAt', label: 'Date', format: 'date' },
];

/** @type {import('@/core/types/table.js').TableAction[]} */
const actions = [
    { label: 'View', handler: 'view', variant: 'ghost' },
    {
        label: 'Delete',
        handler: 'delete',
        variant: 'danger',
        confirm: 'Delete this order?',
    },
];

function handleAction(action, row) {
    if (action.handler === 'view') {
        // Navigate to detail page
    } else if (action.handler === 'delete') {
        remove(row.id);
    }
}

onMounted(() => fetchAll());
</script>

<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-[--color-text]">Orders</h1>
            <AppButton>New Order</AppButton>
        </div>

        <AppTable
            :data="items"
            :columns="columns"
            :actions="actions"
            :loading="isLoading"
            @action="handleAction"
        />
    </div>
</template>
```

## Step 5: Register the Module

Add the module routes to `src/router/index.js`:

```javascript
import acmeRoutes from '@/modules/acme/routes.js';

// In your routes array or use registerModuleRoutes()
registerModuleRoutes(acmeRoutes);
```

## Step 6: Add Custom Actions (Optional)

For complex operations, create workflow definitions in `src/modules/acme/actions/`:

```javascript
// src/modules/acme/actions/cancelOrder.js
import { defineWorkflow } from '@/core/composables/useWorkflow.js';

export const cancelOrderWorkflow = defineWorkflow({
    name: 'Cancel Order',
    steps: [
        {
            id: 'confirm',
            type: 'confirm',
            title: 'Cancel Order',
            message: 'Are you sure you want to cancel order #{id}?',
        },
        {
            id: 'reason',
            type: 'form',
            schema: {
                fields: [
                    {
                        name: 'reason',
                        label: 'Cancellation Reason',
                        type: 'textarea',
                        required: true,
                    },
                ],
            },
        },
        {
            id: 'api',
            type: 'api',
            endpoint: '/orders/{id}/cancel',
            method: 'POST',
            body: { reason: '{reason}' },
        },
        {
            id: 'toast',
            type: 'toast',
            message: 'Order #{id} has been cancelled',
            variant: 'success',
        },
    ],
});
```

## Step 7: Test the Module

1. Start the dev server: `npm run dev`
2. Log in with a user associated with the `acme` module
3. Verify navigation, theming, and pages work correctly
