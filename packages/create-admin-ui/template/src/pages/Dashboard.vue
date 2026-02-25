<script setup lang="ts">
import { AppCard } from '@paya-labs/admin-ui';
</script>

<template>
    <div class="space-y-6">
        <h1 class="text-text text-2xl font-bold">Dashboard</h1>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <AppCard
                title="Total Users"
                value="1,234"
                trend="up"
                trendValue="+5%"
            />
            <AppCard
                title="Active Sessions"
                value="567"
                trend="up"
                trendValue="+12%"
            />
            <AppCard
                title="Revenue"
                value="$12,345"
                trend="down"
                trendValue="-3%"
            />
            <AppCard title="Orders" value="89" trend="up" trendValue="+8%" />
        </div>

        <div class="border-border bg-surface rounded-lg border p-6">
            <h2 class="text-text mb-4 text-lg font-semibold">
                Welcome to your admin dashboard
            </h2>
            <p class="text-muted">
                Start building your backoffice by adding pages, components, and
                routes. Check out the
                <code class="bg-body rounded px-1 py-0.5"
                    >module.config.ts</code
                >
                file to customize your navigation and theme.
            </p>
        </div>
    </div>
</template>
