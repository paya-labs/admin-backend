import { createRouter, createWebHistory } from 'vue-router';
import Api from '../pages/Api.vue';
import Auth from '../pages/Auth.vue';
import Cards from '../pages/Cards.vue';
import Components from '../pages/Components.vue';
import Crud from '../pages/Crud.vue';
import Dashboard from '../pages/Dashboard.vue';
import Forms from '../pages/Forms.vue';
import Icons from '../pages/Icons.vue';
import Modals from '../pages/Modals.vue';
import Pagination from '../pages/Pagination.vue';
import Tables from '../pages/Tables.vue';
import Theme from '../pages/Theme.vue';
import Toast from '../pages/Toast.vue';
import Calendar from "@/pages/Calendar.vue";
import Editor from "@/pages/Editor.vue";

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
    },
    {
        path: '/components',
        name: 'Components',
        component: Components,
    },
    {
        path: '/forms',
        name: 'Forms',
        component: Forms,
    },
    {
        path: '/tables',
        name: 'Tables',
        component: Tables,
    },
    {
        path: '/modals',
        name: 'Modals',
        component: Modals,
    },
    {
        path: '/cards',
        name: 'Cards',
        component: Cards,
    },
    {
        path: '/icons',
        name: 'Icons',
        component: Icons,
    },
    {
        path: '/pagination',
        name: 'Pagination',
        component: Pagination,
    },
    {
        path: '/api',
        name: 'Api',
        component: Api,
    },
    {
        path: '/crud',
        name: 'Crud',
        component: Crud,
    },
    {
        path: '/auth',
        name: 'Auth',
        component: Auth,
    },
    {
        path: '/theme',
        name: 'Theme',
        component: Theme,
    },
    {
        path: '/toast',
        name: 'Toast',
        component: Toast,
    },
    {
        path: '/calendar',
        name: 'Calendar',
        component: Calendar,
    },
    {
        path: '/editor',
        name: 'Editor',
        component: Editor,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
