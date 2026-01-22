/**
 * @typedef {import('@flangofas/admin-ui').ModuleConfig} ModuleConfig
 */

/** @type {ModuleConfig} */
export const moduleConfig = {
    id: 'demo',
    name: 'Admin UI Demo',
    logo: null,
    theme: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#8b5cf6',
    },
    api: {
        baseUrl: '/api',
    },
    navigation: [
        {
            label: 'Dashboard',
            icon: 'home',
            route: '/',
        },
        {
            label: 'Components',
            icon: 'grid',
            route: '/components',
        },
        {
            label: 'Forms',
            icon: 'edit',
            route: '/forms',
        },
        {
            label: 'Tables',
            icon: 'table',
            route: '/tables',
        },
        {
            label: 'Modals',
            icon: 'layers',
            route: '/modals',
        },
        {
            label: 'Cards',
            icon: 'credit-card',
            route: '/cards',
        },
        {
            label: 'Icons',
            icon: 'star',
            route: '/icons',
        },
        {
            label: 'Pagination',
            icon: 'document',
            route: '/pagination',
        },
        {
            label: 'API',
            icon: 'globe-alt',
            route: '/api',
        },
        {
            label: 'CRUD',
            icon: 'folder',
            route: '/crud',
        },
        {
            label: 'Auth',
            icon: 'user',
            route: '/auth',
        },
        {
            label: 'Theme',
            icon: 'cog',
            route: '/theme',
        },
        {
            label: 'Toast',
            icon: 'bell',
            route: '/toast',
        },
    ],
};
