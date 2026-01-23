/**
 * @typedef {import('@paya-labs/admin-ui').ModuleConfig} ModuleConfig
 */

/** @type {ModuleConfig} */
export const moduleConfig = {
    id: '{{PROJECT_IDENTIFIER}}',
    name: '{{PROJECT_NAME}}',
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
        // Add more navigation items here
    ],
};
