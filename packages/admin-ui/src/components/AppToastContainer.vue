<script setup lang="ts">
import { computed } from 'vue';
import { useToast } from '../composables/useToast';
import type { ToastVariant } from '../types';

type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface Props {
    position?: ToastPosition;
    max?: number;
}

const props = withDefaults(defineProps<Props>(), {
    position: 'bottom-right',
    max: 5,
});

const { toasts, dismiss } = useToast();

const visibleToasts = computed(() => {
    const all = toasts.value;
    if (props.position.startsWith('bottom')) {
        return all.slice(-props.max);
    }
    return all.slice(-props.max).reverse();
});

const positionClasses = computed(() => {
    const classes: Record<ToastPosition, string> = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
    };
    return classes[props.position] || classes['bottom-right'];
});

const isRight = computed(() => props.position.includes('right'));

const getVariantClasses = (variant: ToastVariant): string => {
    const variants: Record<ToastVariant, string> = {
        success:
            'bg-success/10 border-success/30 text-success dark:bg-success/20',
        error: 'bg-danger/10 border-danger/30 text-danger dark:bg-danger/20',
        warning:
            'bg-warning/10 border-warning/30 text-warning dark:bg-warning/20',
        info: 'bg-primary/10 border-primary/30 text-primary dark:bg-primary/20',
    };
    return variants[variant] || variants.info;
};

const getVariantIcon = (variant: ToastVariant): string => {
    const icons: Record<ToastVariant, string> = {
        success: `<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>`,
        error: `<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>`,
        warning: `<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>`,
        info: `<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>`,
    };
    return icons[variant] || icons.info;
};
</script>

<template>
    <Teleport to="body">
        <div
            :class="[
                'gap-2 pointer-events-none fixed z-[80] flex flex-col',
                positionClasses,
            ]"
            aria-live="polite"
            aria-label="Notifications"
        >
            <TransitionGroup
                :enter-active-class="`transition duration-200 ease-out`"
                :enter-from-class="`opacity-0 ${isRight ? 'translate-x-full' : '-translate-x-full'}`"
                enter-to-class="opacity-100 translate-x-0"
                :leave-active-class="`transition duration-150 ease-in`"
                leave-from-class="opacity-100 translate-x-0"
                :leave-to-class="`opacity-0 ${isRight ? 'translate-x-full' : '-translate-x-full'}`"
                move-class="transition duration-200 ease-out"
            >
                <div
                    v-for="toast in visibleToasts"
                    :key="toast.id"
                    :class="[
                        'w-80 gap-3 p-4 pointer-events-auto flex items-start rounded-lg border shadow-lg',
                        'bg-surface',
                        getVariantClasses(toast.variant),
                    ]"
                    role="alert"
                >
                    <!-- Icon -->
                    <div
                        class="shrink-0"
                        v-html="getVariantIcon(toast.variant)"
                    />

                    <!-- Content -->
                    <div class="min-w-0 flex-1">
                        <p
                            v-if="toast.title"
                            class="text-sm font-semibold text-text"
                        >
                            {{ toast.title }}
                        </p>
                        <p
                            :class="[
                                'text-sm',
                                toast.title ? 'mt-1 text-muted' : 'text-text',
                            ]"
                        >
                            {{ toast.message }}
                        </p>
                    </div>

                    <!-- Close button -->
                    <button
                        type="button"
                        class="rounded p-1 shrink-0 text-muted transition-colors hover:bg-surface-hover hover:text-text"
                        aria-label="Dismiss notification"
                        @click="dismiss(toast.id)"
                    >
                        <svg
                            class="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>
