<script setup>
import { AdminLayout } from '@paya-labs/admin-ui';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { moduleConfig } from './module.config.js';

const route = useRoute();

// Detect fullscreen routes
const isFullscreen = computed(() => route.path === '/fullscreen-calendar');
</script>

<template>
    <AdminLayout
        :module-name="moduleConfig.name"
        :navigation="moduleConfig.navigation"
        :fullscreen="isFullscreen"
    >
        <router-view />
    </AdminLayout>
</template>
