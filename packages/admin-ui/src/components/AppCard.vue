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
    <div class="border-border bg-surface rounded-lg border p-6">
        <!-- Loading skeleton -->
        <template v-if="loading">
            <div class="animate-pulse">
                <div class="bg-skeleton mb-2 h-4 w-24 rounded" />
                <div class="bg-skeleton mb-2 h-8 w-32 rounded" />
                <div class="bg-skeleton h-4 w-20 rounded" />
            </div>
        </template>

        <!-- Content -->
        <template v-else>
            <div class="flex items-start justify-between">
                <div class="min-w-0 flex-1">
                    <!-- Title -->
                    <p v-if="title" class="text-muted text-sm font-medium">
                        {{ title }}
                    </p>

                    <!-- Value -->
                    <p
                        v-if="value !== ''"
                        class="text-text mt-2 text-3xl font-bold"
                    >
                        {{ value }}
                    </p>

                    <!-- Trend / Subtitle -->
                    <div
                        v-if="trendValue || subtitle"
                        class="mt-1 flex items-center gap-1"
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
                        <span v-if="subtitle" class="text-muted text-sm">
                            {{ subtitle }}
                        </span>
                    </div>
                </div>

                <!-- Icon -->
                <div
                    v-if="icon || $slots.icon"
                    class="bg-primary-soft text-on-primary-soft flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
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
