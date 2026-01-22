<script setup lang="ts">
type TrendDirection = 'up' | 'down' | 'neutral';

interface Props {
    title?: string;
    value?: string | number;
    subtitle?: string;
    icon?: string;
    trend?: TrendDirection;
    trendValue?: string;
    loading?: boolean;
}

withDefaults(defineProps<Props>(), {
    title: '',
    value: '',
    subtitle: '',
    icon: '',
    trend: 'neutral',
    trendValue: '',
    loading: false,
});
</script>

<template>
    <div class="p-6 rounded-lg border border-border bg-surface">
        <!-- Loading skeleton -->
        <template v-if="loading">
            <div class="animate-pulse">
                <div
                    class="mb-2 h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"
                />
                <div
                    class="mb-2 h-8 w-32 rounded bg-gray-200 dark:bg-gray-700"
                />
                <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
        </template>

        <!-- Content -->
        <template v-else>
            <div class="flex items-start justify-between">
                <div class="min-w-0 flex-1">
                    <!-- Title -->
                    <p v-if="title" class="text-sm font-medium text-muted">
                        {{ title }}
                    </p>

                    <!-- Value -->
                    <p
                        v-if="value !== ''"
                        class="mt-2 text-3xl font-bold text-text"
                    >
                        {{ value }}
                    </p>

                    <!-- Trend / Subtitle -->
                    <div
                        v-if="trendValue || subtitle"
                        class="mt-1 gap-1 flex items-center"
                    >
                        <span
                            v-if="trendValue"
                            :class="[
                                'text-sm font-medium',
                                trend === 'up' && 'text-success',
                                trend === 'down' && 'text-danger',
                                trend === 'neutral' && 'text-muted',
                            ]"
                        >
                            <span v-if="trend === 'up'">↑</span>
                            <span v-else-if="trend === 'down'">↓</span>
                            {{ trendValue }}
                        </span>
                        <span v-if="subtitle" class="text-sm text-muted">
                            {{ subtitle }}
                        </span>
                    </div>
                </div>

                <!-- Icon -->
                <div
                    v-if="icon || $slots.icon"
                    class="h-12 w-12 flex flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400"
                >
                    <slot name="icon">
                        <span
                            v-if="icon"
                            class="h-6 w-6 [&>svg]:h-full [&>svg]:w-full"
                            v-html="icon"
                        />
                    </slot>
                </div>
            </div>

            <!-- Extra content slot -->
            <slot />
        </template>
    </div>
</template>
