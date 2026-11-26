<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps<{ open: boolean; title: string }>();
const emit = defineEmits<{ close: [] }>();

const sheetRef = ref<HTMLDivElement | null>(null);

// aria-modal: Tab wraps inside the sheet instead of reaching the page behind
const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
        event.preventDefault();
        emit('close');
        return;
    }
    if (event.key !== 'Tab' || !sheetRef.value) return;
    const focusable = sheetRef.value.querySelectorAll<HTMLElement>(
        'button:not([disabled]):not([tabindex="-1"]), input:not([disabled])',
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && event.target === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && event.target === last) {
        event.preventDefault();
        first.focus();
    }
};

// Same body scroll lock as AppModal
watch(
    () => props.open,
    (open) => {
        document.body.style.overflow = open ? 'hidden' : '';
    },
);
onBeforeUnmount(() => {
    if (props.open) document.body.style.overflow = '';
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
                v-if="open"
                class="fixed inset-0 z-[var(--z-modal)]"
                @keydown="onKeydown"
            >
                <div
                    class="absolute inset-0 bg-black/50"
                    @click="emit('close')"
                />
                <Transition
                    appear
                    enter-active-class="transition-transform duration-200 ease-out"
                    enter-from-class="translate-y-full"
                    enter-to-class="translate-y-0"
                >
                    <div
                        ref="sheetRef"
                        role="dialog"
                        aria-modal="true"
                        :aria-label="title"
                        class="border-border bg-surface text-text absolute inset-x-0 bottom-0 flex flex-col rounded-t-2xl border-t pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(0,0,0,0.18)]"
                    >
                        <div
                            class="bg-border-strong mx-auto mb-1.5 h-1 w-9 rounded-full"
                            aria-hidden="true"
                        />
                        <div
                            class="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-1.5 text-base"
                        >
                            <div class="justify-self-start">
                                <slot name="secondary" />
                            </div>
                            <span class="font-semibold">{{ title }}</span>
                            <button
                                type="button"
                                class="text-on-primary-soft cursor-pointer justify-self-end font-medium"
                                @click="emit('close')"
                            >
                                Done
                            </button>
                        </div>
                        <slot />
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>
