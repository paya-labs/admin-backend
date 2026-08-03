<script setup lang="ts">
import type { ButtonVariant, ControlSize } from '../types';

type ButtonType = 'button' | 'submit' | 'reset';

interface Props {
    variant?: ButtonVariant;
    size?: ControlSize;
    disabled?: boolean;
    loading?: boolean;
    iconOnly?: boolean;
    type?: ButtonType;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    iconOnly: false,
    type: 'button',
});

const emit = defineEmits<{
    click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent): void => {
    if (!props.disabled && !props.loading) {
        emit('click', event);
    }
};
</script>

<template>
    <button
        :type="type"
        :disabled="disabled || loading"
        :class="[
            // Base styles
            'gap-2 font-medium inline-flex cursor-pointer items-center justify-center',
            'transition-all duration-[var(--transition-fast)]',
            'focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',

            // Size variants - text buttons
            !iconOnly && {
                'px-3 py-1.5 text-sm min-h-[36px] rounded-md': size === 'sm',
                'px-4 py-2 text-sm min-h-[44px] rounded-md': size === 'md',
                'px-6 py-3 text-base min-h-[52px] rounded-lg': size === 'lg',
            },

            // Size variants - icon only
            iconOnly && {
                'p-2 min-h-[36px] min-w-[36px] rounded-md': size === 'sm',
                'p-2.5 min-h-[44px] min-w-[44px] rounded-md': size === 'md',
                'p-3 min-h-[52px] min-w-[52px] rounded-lg': size === 'lg',
            },

            // Variant styles
            {
                'text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800':
                    variant === 'primary',
                'bg-secondary text-text hover:bg-secondary-hover':
                    variant === 'secondary',
                'text-white bg-danger hover:opacity-90 active:opacity-80':
                    variant === 'danger',
                'bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text':
                    variant === 'ghost',
                'border border-border bg-transparent text-text hover:bg-surface-hover':
                    variant === 'outline',
            },
        ]"
        @click="handleClick"
    >
        <!-- Loading spinner -->
        <svg
            v-if="loading"
            class="h-4 w-4 animate-spin"
            :class="{ '-ml-1': !iconOnly && $slots.default }"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            />
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>

        <slot v-if="!loading || !iconOnly" />
    </button>
</template>
