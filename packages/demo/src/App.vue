<script setup>
import { AdminLayout } from '@paya-labs/admin-ui';
import { moduleConfig } from './module.config.js';
</script>

<template>
    <AdminLayout
        :module-name="moduleConfig.name"
        :navigation="moduleConfig.navigation"
    >
        <router-view />
    </AdminLayout>
</template>
