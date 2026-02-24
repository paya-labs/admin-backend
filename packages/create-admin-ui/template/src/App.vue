<script setup lang="ts">
import { AdminLayout } from '@paya-labs/admin-ui';
import { moduleConfig } from './module.config';
</script>

<template>
    <AdminLayout :navigation="moduleConfig.navigation">
        <router-view />
    </AdminLayout>
</template>
