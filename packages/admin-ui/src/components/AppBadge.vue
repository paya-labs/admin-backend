<script setup lang="ts">
type BadgeVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface Props {
    variant?: BadgeVariant;
    size?: BadgeSize;
    rounded?: boolean;
}

withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    rounded: false,
});
</script>

<template>
    <span
        :class="[
            'font-medium inline-flex items-center',

            // Size
            size === 'sm' && 'px-1.5 py-0.5 text-xs',
            size === 'md' && 'px-2 py-0.5 text-xs',
            size === 'lg' && 'px-2.5 py-1 text-sm',

            // Border radius
            rounded ? 'rounded-full' : 'rounded-sm',

            // Variants
            variant === 'primary' &&
                'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
            variant === 'secondary' &&
                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
            variant === 'success' &&
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
            variant === 'warning' &&
                'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
            variant === 'danger' &&
                'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
            variant === 'info' &&
                'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-400',
        ]"
    >
        <slot />
    </span>
</template>
