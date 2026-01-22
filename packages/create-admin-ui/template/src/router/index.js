import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../pages/Dashboard.vue';

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
    },
    // Add more routes here
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
