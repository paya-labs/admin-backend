<script setup>
import { AppBadge, AppButton, AppCard, AppIcon } from '@paya-labs/admin-ui';
import { ref } from 'vue';

// Loading state toggle
const isLoading = ref(false);
</script>

<template>
    <div class="space-y-8">
        <h1 class="text-text text-2xl font-bold">
            Card Patterns
        </h1>

        <!-- Basic Stats Grid -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Stats Grid (4 Columns)
            </h2>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <AppCard
                    title="Total Users"
                    value="12,345"
                />
                <AppCard
                    title="Revenue"
                    value="$45,678"
                />
                <AppCard
                    title="Orders"
                    value="1,234"
                />
                <AppCard
                    title="Visitors"
                    value="56,789"
                />
            </div>
        </section>

        <!-- Cards with Trends -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Cards with Trend Indicators
            </h2>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <AppCard
                    title="Total Users"
                    value="12,345"
                    trend="up"
                    trend-value="+12.5%"
                    subtitle="from last month"
                />
                <AppCard
                    title="Revenue"
                    value="$45,678"
                    trend="up"
                    trend-value="+8.2%"
                    subtitle="from last month"
                />
                <AppCard
                    title="Orders"
                    value="1,234"
                    trend="down"
                    trend-value="-3.1%"
                    subtitle="from last month"
                />
                <AppCard
                    title="Bounce Rate"
                    value="24.5%"
                    trend="neutral"
                    trend-value="0%"
                    subtitle="no change"
                />
            </div>
        </section>

        <!-- Cards with Icons -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Cards with Icons
            </h2>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <AppCard
                    title="Total Users"
                    value="12,345"
                    trend="up"
                    trend-value="+12.5%"
                >
                    <template #icon>
                        <AppIcon
                            name="users"
                            size="lg"
                        />
                    </template>
                </AppCard>
                <AppCard
                    title="Revenue"
                    value="$45,678"
                    trend="up"
                    trend-value="+8.2%"
                >
                    <template #icon>
                        <AppIcon
                            name="currency-dollar"
                            size="lg"
                        />
                    </template>
                </AppCard>
                <AppCard
                    title="Orders"
                    value="1,234"
                    trend="down"
                    trend-value="-3.1%"
                >
                    <template #icon>
                        <AppIcon
                            name="shopping-cart"
                            size="lg"
                        />
                    </template>
                </AppCard>
                <AppCard
                    title="Visitors"
                    value="56,789"
                    trend="up"
                    trend-value="+18.7%"
                >
                    <template #icon>
                        <AppIcon
                            name="eye"
                            size="lg"
                        />
                    </template>
                </AppCard>
            </div>
        </section>

        <!-- Loading State -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Loading State
            </h2>
            <div class="flex items-center gap-4">
                <AppButton
                    variant="outline"
                    size="sm"
                    @click="isLoading = !isLoading"
                >
                    Toggle Loading
                </AppButton>
                <span class="text-muted text-sm">
                    {{ isLoading ? 'Loading...' : 'Loaded' }}
                </span>
            </div>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <AppCard
                    title="Users"
                    value="12,345"
                    :loading="isLoading"
                />
                <AppCard
                    title="Revenue"
                    value="$45,678"
                    :loading="isLoading"
                />
                <AppCard
                    title="Orders"
                    value="1,234"
                    :loading="isLoading"
                />
                <AppCard
                    title="Visitors"
                    value="56,789"
                    :loading="isLoading"
                />
            </div>
        </section>

        <!-- Cards with Custom Content -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Cards with Custom Slot Content
            </h2>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AppCard
                    title="Active Users"
                    value="1,234"
                >
                    <div class="mt-4 flex items-center gap-2">
                        <AppBadge variant="success">
                            Online: 892
                        </AppBadge>
                        <AppBadge variant="default">
                            Offline: 342
                        </AppBadge>
                    </div>
                </AppCard>

                <AppCard
                    title="Server Status"
                    value="99.9%"
                >
                    <div class="mt-4">
                        <div
                            class="text-muted mb-1 flex justify-between text-xs"
                        >
                            <span>Uptime</span>
                            <span>99.9%</span>
                        </div>
                        <div
                            class="h-2 rounded-full bg-gray-200 dark:bg-gray-700"
                        >
                            <div
                                class="bg-success h-2 rounded-full"
                                style="width: 99.9%"
                            ></div>
                        </div>
                    </div>
                </AppCard>

                <AppCard title="Quick Actions">
                    <div class="mt-4 flex flex-wrap gap-2">
                        <AppButton
                            variant="outline"
                            size="sm"
                        >
                            Export
                        </AppButton>
                        <AppButton
                            variant="outline"
                            size="sm"
                        >
                            Import
                        </AppButton>
                        <AppButton
                            variant="primary"
                            size="sm"
                        >
                            New Item
                        </AppButton>
                    </div>
                </AppCard>
            </div>
        </section>

        <!-- Two Column Layout -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Two Column Layout
            </h2>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <AppCard
                    title="Monthly Revenue"
                    value="$123,456"
                    trend="up"
                    trend-value="+15.3%"
                    subtitle="Compared to last month"
                >
                    <template #icon>
                        <AppIcon
                            name="currency-dollar"
                            size="lg"
                        />
                    </template>
                </AppCard>
                <AppCard
                    title="New Customers"
                    value="456"
                    trend="up"
                    trend-value="+22.1%"
                    subtitle="This month"
                >
                    <template #icon>
                        <AppIcon
                            name="users"
                            size="lg"
                        />
                    </template>
                </AppCard>
            </div>
        </section>

        <!-- Icon Slot Example -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">
                Custom Icon Slot
            </h2>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AppCard
                    title="Success Rate"
                    value="98.5%"
                >
                    <template #icon>
                        <AppIcon
                            name="check-circle"
                            size="lg"
                        />
                    </template>
                </AppCard>
                <AppCard
                    title="Warnings"
                    value="12"
                >
                    <template #icon>
                        <AppIcon
                            name="exclamation-circle"
                            size="lg"
                        />
                    </template>
                </AppCard>
                <AppCard
                    title="Errors"
                    value="3"
                >
                    <template #icon>
                        <AppIcon
                            name="x-circle"
                            size="lg"
                        />
                    </template>
                </AppCard>
            </div>
        </section>
    </div>
</template>
