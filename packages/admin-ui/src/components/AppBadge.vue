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
            variant === 'primary' && 'text-white bg-primary-600',
            variant === 'secondary' && 'bg-surface text-text',
            variant === 'success' && 'text-white bg-success/70',
            variant === 'warning' && 'text-white bg-warning/70',
            variant === 'danger' && 'text-white bg-danger/70',
            variant === 'info' && 'text-white bg-info/70',
        ]"
    >
        <slot />
    </span>
</template>
