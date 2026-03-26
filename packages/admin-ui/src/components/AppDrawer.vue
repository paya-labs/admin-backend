<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue';
import type { DrawerPosition, DrawerSize } from '../types';
import AppButton from './AppButton.vue';

interface Props {
    modelValue?: boolean;
    title?: string;
    size?: DrawerSize;
    position?: DrawerPosition;
    closable?: boolean;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    title: '',
    size: 'md',
    position: 'right',
    closable: true,
    closeOnBackdrop: true,
    closeOnEscape: true,
});

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    close: [];
}>();

const drawerRef = ref<HTMLElement | null>(null);
const titleId = `drawer-title-${Math.random().toString(36).slice(2, 11)}`;
let previouslyFocusedElement: HTMLElement | null = null;

const close = (): void => {
    if (props.closable) {
        emit('update:modelValue', false);
        emit('close');
    }
};

const handleBackdropClick = (): void => {
    if (props.closeOnBackdrop) {
        close();
    }
};

const handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && props.closeOnEscape && props.modelValue) {
        close();
        return;
    }

    // Focus trap: Tab and Shift+Tab
    if (e.key === 'Tab' && props.modelValue && drawerRef.value) {
        const focusableElements = drawerRef.value.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
        }
    }
};

const focusFirstElement = () => {
    if (!drawerRef.value) return;

    const focusableElements = drawerRef.value.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    // Try to focus the first input, then first focusable element
    const firstInput = drawerRef.value.querySelector<HTMLElement>(
        'input, select, textarea',
    );
    if (firstInput) {
        firstInput.focus();
    } else if (focusableElements[0]) {
        focusableElements[0].focus();
    }
};

// Size classes
const sizeClasses: Record<DrawerSize, string> = {
    sm: 'w-80', // 320px
    md: 'w-[400px]',
    lg: 'w-[480px]',
    xl: 'w-[600px]',
};

watch(
    () => props.modelValue,
    async (isOpen) => {
        if (isOpen) {
            // Store currently focused element
            previouslyFocusedElement = document.activeElement as HTMLElement;

            document.addEventListener('keydown', handleKeydown);
            document.body.style.overflow = 'hidden';

            // Focus first element after drawer renders
            await nextTick();
            focusFirstElement();
        } else {
            document.removeEventListener('keydown', handleKeydown);
            document.body.style.overflow = '';

            // Restore focus to previously focused element without scrolling
            if (previouslyFocusedElement) {
                previouslyFocusedElement.focus({ preventScroll: true });
                previouslyFocusedElement = null;
            }
        }
    },
    { immediate: true },
);

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
});
</script>

<template>
    <Teleport to="body">
        <!-- Backdrop -->
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="modelValue"
                class="inset-0 bg-black/50 fixed z-[var(--z-overlay)]"
                @click="handleBackdropClick"
            />
        </Transition>

        <!-- Drawer panel -->
        <Transition
            :enter-active-class="`transition duration-300 ease-out transform`"
            :enter-from-class="
                position === 'left' ? '-translate-x-full' : 'translate-x-full'
            "
            enter-to-class="translate-x-0"
            :leave-active-class="`transition duration-200 ease-in transform`"
            leave-from-class="translate-x-0"
            :leave-to-class="
                position === 'left' ? '-translate-x-full' : 'translate-x-full'
            "
        >
            <div
                v-if="modelValue"
                ref="drawerRef"
                :class="[
                    'inset-y-0 fixed z-[var(--z-modal)] flex flex-col bg-surface shadow-[var(--shadow-lg)]',
                    sizeClasses[size],
                    position === 'left' ? 'left-0' : 'right-0',
                ]"
                role="dialog"
                aria-modal="true"
                :aria-labelledby="title ? titleId : undefined"
            >
                <!-- Header -->
                <div
                    v-if="title || $slots.header || closable"
                    class="px-6 py-4 flex shrink-0 items-center justify-between border-b border-border"
                >
                    <slot name="header">
                        <h2
                            v-if="title"
                            :id="titleId"
                            class="text-lg font-semibold text-text"
                        >
                            {{ title }}
                        </h2>
                    </slot>

                    <AppButton
                        v-if="closable"
                        variant="ghost"
                        size="sm"
                        icon-only
                        aria-label="Close drawer"
                        @click="close"
                    >
                        <svg
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </AppButton>
                </div>

                <!-- Body -->
                <div class="flex-1 overflow-y-auto">
                    <slot />
                </div>

                <!-- Footer -->
                <div
                    v-if="$slots.footer"
                    class="gap-3 px-6 py-4 flex shrink-0 items-center justify-end border-t border-border"
                >
                    <slot name="footer" />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
