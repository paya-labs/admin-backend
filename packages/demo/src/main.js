import { AdminUIPlugin } from '@flangofas/admin-ui';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

const app = createApp(App);

app.use(router);
app.use(AdminUIPlugin);

app.mount('#app');
