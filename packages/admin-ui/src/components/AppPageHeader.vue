<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router';

export interface Breadcrumb {
    label: string;
    to?: RouteLocationRaw;
}

defineProps<{
    title: string;
    description?: string;
    breadcrumbs?: Breadcrumb[];
}>();
</script>

<template>
    <!-- Actions sit right of the title; below 768px they wrap underneath -->
    <div class="flex flex-wrap items-start justify-between gap-3">
        <div class="min-w-0 space-y-1 max-md:w-full">
            <nav
                v-if="breadcrumbs?.length"
                aria-label="Breadcrumb"
                class="text-muted text-sm"
            >
                <template v-for="(crumb, i) in breadcrumbs" :key="i">
                    <span v-if="i > 0" aria-hidden="true"> › </span>
                    <RouterLink
                        v-if="crumb.to && i < breadcrumbs.length - 1"
                        :to="crumb.to"
                        class="hover:underline"
                        >{{ crumb.label }}</RouterLink
                    >
                    <span
                        v-else
                        :aria-current="
                            i === breadcrumbs.length - 1 ? 'page' : undefined
                        "
                        >{{ crumb.label }}</span
                    >
                </template>
            </nav>
            <h1 class="text-text text-lg font-semibold">{{ title }}</h1>
            <p v-if="description" class="text-muted text-sm">
                {{ description }}
            </p>
        </div>
        <div v-if="$slots.default" class="flex shrink-0 items-center gap-3">
            <slot />
        </div>
    </div>
</template>
