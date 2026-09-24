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
                class="inset-0 fixed z-[var(--z-modal)]"
                @keydown="onKeydown"
            >
                <div
                    class="inset-0 bg-black/50 absolute"
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
                        class="inset-x-0 bottom-0 rounded-t-2xl pt-2 absolute flex flex-col border-t border-border bg-surface pb-[max(0.75rem,env(safe-area-inset-bottom))] text-text shadow-[0_-8px_32px_rgba(0,0,0,0.18)]"
                    >
                        <div
                            class="mb-1.5 h-1 w-9 mx-auto rounded-full bg-border-strong"
                            aria-hidden="true"
                        />
                        <div
                            class="px-4 py-1.5 text-base grid grid-cols-[1fr_auto_1fr] items-center"
                        >
                            <div class="justify-self-start">
                                <slot name="secondary" />
                            </div>
                            <span class="font-semibold">{{ title }}</span>
                            <button
                                type="button"
                                class="font-medium cursor-pointer justify-self-end text-on-primary-soft"
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
