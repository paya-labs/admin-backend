import router from '@/router';
import '@/style.css';
import { AdminUIPlugin } from '@paya-labs/admin-ui';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.use(router);
app.use(AdminUIPlugin);

app.mount('#app');
