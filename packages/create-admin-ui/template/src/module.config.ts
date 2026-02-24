import type { ModuleConfig } from '@paya-labs/admin-ui';

export const moduleConfig: ModuleConfig = {
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
            to: '/',
        },
        // Add more navigation items here
    ],
};
