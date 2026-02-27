<script setup lang="ts">
import { watch, ref, nextTick, onUnmounted } from 'vue';
import type { ModalSize } from '../types';
import AppButton from './AppButton.vue';

interface Props {
    modelValue?: boolean;
    title?: string;
    size?: ModalSize;
    closable?: boolean;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    title: '',
    size: 'md',
    closable: true,
    closeOnBackdrop: true,
    closeOnEscape: true,
});

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    close: [];
}>();

const modalRef = ref<HTMLElement | null>(null);
const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`;
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
    if (e.key === 'Tab' && props.modelValue && modalRef.value) {
        const focusableElements = modalRef.value.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
    if (!modalRef.value) return;

    const focusableElements = modalRef.value.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    // Try to focus the first input, then first focusable element
    const firstInput = modalRef.value.querySelector<HTMLElement>('input, select, textarea');
    if (firstInput) {
        firstInput.focus();
    } else if (focusableElements[0]) {
        focusableElements[0].focus();
    }
};

watch(
    () => props.modelValue,
    async (isOpen) => {
        if (isOpen) {
            // Store currently focused element
            previouslyFocusedElement = document.activeElement as HTMLElement;

            document.addEventListener('keydown', handleKeydown);
            document.body.style.overflow = 'hidden';

            // Focus first element after modal renders
            await nextTick();
            focusFirstElement();
        } else {
            document.removeEventListener('keydown', handleKeydown);
            document.body.style.overflow = '';

            // Restore focus to previously focused element
            if (previouslyFocusedElement) {
                previouslyFocusedElement.focus();
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
                class="inset-0 p-4 fixed z-[var(--z-modal)] flex items-center justify-center"
            >
                <!-- Backdrop -->
                <div
                    class="inset-0 bg-black/50 absolute"
                    @click="handleBackdropClick"
                />

                <!-- Modal panel -->
                <Transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95"
                >
                    <div
                        v-if="modelValue"
                        ref="modalRef"
                        :class="[
                            'relative flex max-h-[90vh] flex-col overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-lg)]',

                            // Size variants
                            size === 'sm' && 'max-w-sm w-full',
                            size === 'md' && 'max-w-md w-full',
                            size === 'lg' && 'max-w-lg w-full',
                            size === 'xl' && 'max-w-xl w-full',
                            size === 'full' &&
                                'h-full w-full max-w-none rounded-none',
                        ]"
                        role="dialog"
                        aria-modal="true"
                        :aria-labelledby="title ? titleId : undefined"
                    >
                        <!-- Header -->
                        <div
                            v-if="title || $slots.header || closable"
                            class="px-6 py-4 flex items-center justify-between border-b border-border"
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
                                aria-label="Close modal"
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
                        <div class="px-6 py-4 flex-1 overflow-y-auto">
                            <slot />
                        </div>

                        <!-- Footer -->
                        <div
                            v-if="$slots.footer"
                            class="gap-3 px-6 py-4 flex items-center justify-end border-t border-border"
                        >
                            <slot name="footer" />
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>
