<script setup>
import { AppCard } from '@paya-labs/admin-ui';
</script>

<template>
    <div class="space-y-6">
        <h1 class="text-text text-2xl font-bold">Dashboard</h1>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <AppCard
                title="Total Users"
                value="1,234"
                trend="+12%"
                trend-direction="up"
            />
            <AppCard
                title="Active Sessions"
                value="567"
                trend="+5%"
                trend-direction="up"
            />
            <AppCard
                title="Revenue"
                value="$12,345"
                trend="-3%"
                trend-direction="down"
            />
            <AppCard
                title="Orders"
                value="89"
                trend="+8%"
                trend-direction="up"
            />
        </div>

        <div class="border-border bg-surface rounded-lg border p-6">
            <h2 class="text-text mb-4 text-lg font-semibold">
                Welcome to the Admin UI Demo
            </h2>
            <p class="text-muted">
                This is a development playground for testing admin-ui
                components. Navigate to the
                <router-link
                    to="/components"
                    class="text-primary-600 hover:underline"
                >
                    Components
                </router-link>
                page to see all available components in action.
            </p>
        </div>
    </div>
</template>
