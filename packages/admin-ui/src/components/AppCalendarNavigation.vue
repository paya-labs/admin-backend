<script setup lang="ts">
import AppButton from './AppButton.vue';

interface Props {
    title: string;
    viewLabel?: string;
}

defineProps<Props>();

defineEmits<{
    prev: [];
    next: [];
    today: [];
}>();
</script>

<template>
    <div class="gap-3 flex items-center">
        <!-- Prev/Next buttons -->
        <div class="flex">
            <AppButton
                variant="ghost"
                icon-only
                size="sm"
                aria-label="Previous"
                @click="$emit('prev')"
            >
                <svg
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </AppButton>
            <AppButton
                variant="ghost"
                icon-only
                size="sm"
                aria-label="Next"
                @click="$emit('next')"
            >
                <svg
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </AppButton>
        </div>

        <!-- Title: "Mar 30 - Apr 5, 2026" -->
        <h1 class="text-lg font-semibold text-text">
            {{ title }}
        </h1>

        <!-- Current view label -->
        <span v-if="viewLabel" class="text-sm text-muted">{{ viewLabel }}</span>

        <!-- Today button -->
        <AppButton variant="secondary" size="sm" @click="$emit('today')">
            Today
        </AppButton>
    </div>
</template>
